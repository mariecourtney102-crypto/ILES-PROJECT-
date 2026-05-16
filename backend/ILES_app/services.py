"""
Email utility service for sending various notification emails.
Centralized email sending logic for the application.
"""

from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_plain_email(subject, message, recipient_list, from_email=None):
    """
    Send a simple plain text email.
    
    Args:
        subject (str): Email subject
        message (str): Email body (plain text)
        recipient_list (list): List of recipient email addresses
        from_email (str): Sender email address (defaults to DEFAULT_FROM_EMAIL)
    
    Returns:
        int: Number of successfully sent emails
    """
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL or 'no-reply@iles.local'
    
    try:
        result = send_mail(
            subject,
            message,
            from_email,
            recipient_list,
            fail_silently=False,
        )
        logger.info(f"Email sent to {recipient_list}: {subject}")
        return result
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_list}: {str(e)}")
        return 0


def send_html_email(subject, template_name, context, recipient_list, from_email=None):
    """
    Send an HTML email using a template.
    
    Args:
        subject (str): Email subject
        template_name (str): Path to HTML template (e.g., 'emails/verification.html')
        context (dict): Context variables for template rendering
        recipient_list (list): List of recipient email addresses
        from_email (str): Sender email address (defaults to DEFAULT_FROM_EMAIL)
    
    Returns:
        int: Number of successfully sent emails
    """
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL or 'no-reply@iles.local'
    
    try:
        # Render HTML template
        html_message = render_to_string(template_name, context)
        text_message = strip_tags(html_message)
        
        # Create email with both text and HTML versions
        email = EmailMultiAlternatives(
            subject,
            text_message,
            from_email,
            recipient_list
        )
        email.attach_alternative(html_message, "text/html")
        result = email.send()
        
        logger.info(f"HTML email sent to {recipient_list}: {subject}")
        return result
    except Exception as e:
        logger.error(f"Failed to send HTML email to {recipient_list}: {str(e)}")
        return 0


def send_email_verification(user, verification_link):
    """
    Send email verification email to user.
    
    Args:
        user (CustomUser): User object
        verification_link (str): Full URL for email verification
    
    Returns:
        int: Number of successfully sent emails
    """
    subject = "Verify Your Email - ILES System"
    context = {
        'user_name': user.name or user.username,
        'verification_link': verification_link,
    }
    
    return send_html_email(
        subject,
        'emails/verify_email.html',
        context,
        [user.email]
    )


def send_registration_confirmation(user):
    """
    Send registration confirmation email.
    
    Args:
        user (CustomUser): User object
    
    Returns:
        int: Number of successfully sent emails
    """
    subject = "Welcome to ILES System"
    context = {
        'user_name': user.name or user.username,
        'role': user.get_role_display() if hasattr(user, 'get_role_display') else user.role,
    }
    
    return send_html_email(
        subject,
        'emails/registration_confirmation.html',
        context,
        [user.email]
    )


def send_password_reset_email(user, reset_link):
    """
    Send password reset email.
    
    Args:
        user (CustomUser): User object
        reset_link (str): Full URL for password reset
    
    Returns:
        int: Number of successfully sent emails
    """
    subject = "Reset Your Password - ILES System"
    context = {
        'user_name': user.name or user.username,
        'reset_link': reset_link,
    }
    
    return send_html_email(
        subject,
        'emails/password_reset.html',
        context,
        [user.email]
    )


def send_weekly_log_submitted(student, supervisor, week_number):
    """
    Send notification when weekly log is submitted.
    
    Args:
        student (CustomUser): Student who submitted
        supervisor (CustomUser): Assigned supervisor
        week_number (int): Week number of the log
    
    Returns:
        int: Number of successfully sent emails
    """
    subject = f"New Weekly Log Submission - Week {week_number}"
    context = {
        'supervisor_name': supervisor.name or supervisor.username,
        'student_name': student.name or student.username,
        'week_number': week_number,
    }
    
    return send_html_email(
        subject,
        'emails/weekly_log_submitted.html',
        context,
        [supervisor.email]
    )


def send_weekly_log_approved(student, supervisor, week_number):
    """
    Send notification when weekly log is approved.
    
    Args:
        student (CustomUser): Student who submitted
        supervisor (CustomUser): Supervisor who approved
        week_number (int): Week number of the log
    
    Returns:
        int: Number of successfully sent emails
    """
    subject = f"Weekly Log Approved - Week {week_number}"
    context = {
        'student_name': student.name or student.username,
        'supervisor_name': supervisor.name or supervisor.username,
        'week_number': week_number,
    }
    
    return send_html_email(
        subject,
        'emails/weekly_log_approved.html',
        context,
        [student.email]
    )


def send_weekly_log_rejected(student, supervisor, week_number, reason):
    """
    Send notification when weekly log is rejected.
    
    Args:
        student (CustomUser): Student who submitted
        supervisor (CustomUser): Supervisor who rejected
        week_number (int): Week number of the log
        reason (str): Reason for rejection
    
    Returns:
        int: Number of successfully sent emails
    """
    subject = f"Weekly Log Rejected - Week {week_number}"
    context = {
        'student_name': student.name or student.username,
        'supervisor_name': supervisor.name or supervisor.username,
        'week_number': week_number,
        'rejection_reason': reason,
    }
    
    return send_html_email(
        subject,
        'emails/weekly_log_rejected.html',
        context,
        [student.email]
    )


def send_supervisor_assigned(student, supervisor):
    """
    Send notification when supervisor is assigned to student.
    
    Args:
        student (CustomUser): Student assigned
        supervisor (CustomUser): Assigned supervisor
    
    Returns:
        int: Number of successfully sent emails
    """
    subject = "Supervisor Assignment Notification"
    context = {
        'student_name': student.name or student.username,
        'supervisor_name': supervisor.name or supervisor.username,
        'supervisor_email': supervisor.email,
    }
    
    return send_html_email(
        subject,
        'emails/supervisor_assigned.html',
        context,
        [student.email]
    )


def send_login_alert(user, ip_address, user_agent):
    """
    Send login alert email for security purposes.
    
    Args:
        user (CustomUser): User who logged in
        ip_address (str): IP address of login
        user_agent (str): User agent string
    
    Returns:
        int: Number of successfully sent emails
    """
    subject = "Login Alert - ILES System"
    context = {
        'user_name': user.name or user.username,
        'ip_address': ip_address,
        'user_agent': user_agent,
    }
    
    return send_html_email(
        subject,
        'emails/login_alert.html',
        context,
        [user.email]
    )
