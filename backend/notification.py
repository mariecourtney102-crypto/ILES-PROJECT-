from tkinter import Place

from django.core.mail import send_mail
from django.conf import settings

def notify_supervisor_student_assigned(supervisor, student, internship_placement):
    send_mail(
        subject='New Student Assigned to YOU ',
        message=f'''
Dear {supervisor.get_full_name()},

A New Student has been assigned to you for supervision 
Student Name: {student.get_full_name()}
Student Email: {student.email}
Place of Internship : {Place.of.internship_name}
Start Date: {insternship.start_date}

Please log in to the ILES PORTAL to view their profile and logbook 

Regards,
ILES System
     ''',
     from_email=settings.DEFAULT_FROM_EMAIL,
     recipient_list=[supervisor.email]
     fail_silently=False


def notify_supervisor_log_submitted(supervisor, student, log):
    send_mail(
        subject=f'New Weekly Log Submitted – {student.get_full_name()}',
        message=f'''
Dear {supervisor.get_full_name()},

{student.get_full_name()} has submitted a new weekly log for your review.

Week Number:   {log.week_number}
Submitted On:  {log.submitted_at.strftime("%d %B %Y")}
Status:        Pending Review

Please log in to the ILES portal to review and approve or reject the log.

Regards,
ILES System
        ''',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[supervisor.email],
        fail_silently=False,
    )


def notify_student_log_submitted(student, log):
    send_mail(
        subject=f'Weekly Log Submitted Successfully – Week {log.week_number}',
        message=f'''
Dear {student.get_full_name()},

Your weekly log has been submitted successfully and is now awaiting review.

Week Number:   {log.week_number}
Submitted On:  {log.submitted_at.strftime("%d %B %Y")}
Status:        Pending Review

You will be notified once your supervisor reviews your log.

Regards,
ILES System
        ''',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[student.email],
        fail_silently=False,
    )


def notify_student_log_approved(student, log):
    send_mail(
        subject=f'Weekly Log Approved – Week {log.week_number}',
        message=f'''
Dear {student.get_full_name()},

Great news! Your weekly log has been approved by your supervisor.

Week Number:   {log.week_number}
Reviewed On:   {log.reviewed_at.strftime("%d %B %Y")}
Status:        Approved ✓

Keep up the good work!

Regards,
ILES System
        ''',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[student.email],
        fail_silently=False,
    )

def notify_student_log_rejected(student, log, feedback):
    send_mail(
        subject=f'Weekly Log Rejected – Week {log.week_number}',
        message=f'''
Dear {student.get_full_name()},

Your weekly log has been reviewed and requires revision.

Week Number:   {log.week_number}
Reviewed On:   {log.reviewed_at.strftime("%d %B %Y")}
Status:        Rejected ✗

Supervisor Feedback:
{feedback}

Please log in to the ILES portal to revise and resubmit your log.

Regards,
ILES System
        ''',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[student.email],
        fail_silently=False,
    )


def notify_admin_student_signup(student):
    from django.contrib.auth import get_user_model
    User = get_user_model()

    # Get all admins
    admins = User.objects.filter(is_staff=True, is_active=True)
    admin_emails = [admin.email for admin in admins if admin.email]

    send_mail(
        subject=f'New Student Registration – {student.get_full_name()}',
        message=f'''
Dear Admin,

A new student has registered on the ILES portal and may need account approval.

Student Name:    {student.get_full_name()}
Student Email:   {student.email}
Username:        {student.username}
Registered On:   {student.date_joined.strftime("%d %B %Y")}

Please log in to the admin panel to review and activate the account.

Regards,
ILES System
        ''',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=admin_emails,
        fail_silently=False,
    )
    