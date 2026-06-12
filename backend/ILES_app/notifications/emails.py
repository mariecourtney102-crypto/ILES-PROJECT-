from django.contrib.auth import get_user_model

from ILES_app.services import send_html_email, send_plain_email

User = get_user_model()


def _resolve_user(entity):
    return getattr(entity, "users", entity)


def _display_name(entity):
    user = _resolve_user(entity)
    return getattr(user, "name", "") or getattr(user, "username", "") or getattr(user, "email", "")


def _email(entity):
    user = _resolve_user(entity)
    return getattr(user, "email", "").strip()


def notify_supervisor_student_assigned(supervisor, student, internship):
    supervisor_user = _resolve_user(supervisor)
    recipient = _email(supervisor_user)
    if not recipient:
        return 0

    subject = "New Student Assigned - ILES System"
    message = (
        f"Hello {_display_name(supervisor_user)},\n\n"
        f"You have been assigned a new student in the ILES system.\n\n"
        f"Student: {_display_name(student)}\n"
        f"Internship Place: {internship.place_of_internship if internship else 'N/A'}\n"
        f"Department: {getattr(internship, 'department', '')}\n"
        f"Start Date: {getattr(internship, 'start_date', '')}\n"
        f"End Date: {getattr(internship, 'end_date', '')}\n\n"
        f"Please log in to review the student's progress and weekly logs."
    )
    return send_plain_email(subject, message, [recipient])


def notify_supervisor_log_submitted(supervisor, student, log):
    supervisor_user = _resolve_user(supervisor)
    recipient = _email(supervisor_user)
    if not recipient:
        return 0

    subject = f"New Weekly Log Submission - Week {log.week_number}"
    context = {
        "supervisor_name": _display_name(supervisor_user),
        "student_name": _display_name(student),
        "week_number": log.week_number,
    }
    return send_html_email(subject, "emails/weekly_log_submitted.html", context, [recipient])


def notify_student_log_submitted(student, log):
    student_user = _resolve_user(student)
    recipient = _email(student_user)
    if not recipient:
        return 0

    subject = f"Weekly Log Submitted - Week {log.week_number}"
    message = (
        f"Hello {_display_name(student_user)},\n\n"
        f"Your weekly log for week {log.week_number} was submitted successfully.\n"
        f"Status: {getattr(log, 'status', 'pending')}\n\n"
        f"You will be notified when your supervisor reviews it."
    )
    return send_plain_email(subject, message, [recipient])


def notify_student_log_approved(student, log):
    student_user = _resolve_user(student)
    recipient = _email(student_user)
    if not recipient:
        return 0

    supervisor_user = _resolve_user(getattr(log, "supervisor", None))
    context = {
        "student_name": _display_name(student_user),
        "supervisor_name": _display_name(supervisor_user),
        "week_number": log.week_number,
    }
    subject = f"Weekly Log Approved - Week {log.week_number}"
    return send_html_email(subject, "emails/weekly_log_approved.html", context, [recipient])


def notify_student_log_rejected(student, log, feedback):
    student_user = _resolve_user(student)
    recipient = _email(student_user)
    if not recipient:
        return 0

    supervisor_user = _resolve_user(getattr(log, "supervisor", None))
    context = {
        "student_name": _display_name(student_user),
        "supervisor_name": _display_name(supervisor_user),
        "week_number": log.week_number,
        "rejection_reason": feedback or getattr(log, "supervisor_comment", ""),
    }
    subject = f"Weekly Log Rejected - Week {log.week_number}"
    return send_html_email(subject, "emails/weekly_log_rejected.html", context, [recipient])


def notify_admin_student_signup(student):
    subject = "New Student Registration - ILES System"
    recipient_list = list(
        User.objects.filter(role="admin")
        .exclude(email="")
        .values_list("email", flat=True)
    )
    if not recipient_list:
        return 0

    message = (
        f"A new student has registered in the ILES system.\n\n"
        f"Name: {_display_name(student)}\n"
        f"Email: {_email(student)}\n"
        f"Username: {getattr(_resolve_user(student), 'username', '')}\n"
        f"ID Number: {getattr(_resolve_user(student), 'ID_number', '')}"
    )
    return send_plain_email(subject, message, recipient_list)
