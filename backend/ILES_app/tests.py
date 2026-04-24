from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Admin, CustomUser, Student, Supervisor, WeeklyLog


class SupervisorAssignmentFlowTests(APITestCase):
    def setUp(self):
        self.admin_user = CustomUser.objects.create_user(
            username='admin1',
            password='pass12345',
            role='admin',
            name='System Admin',
            ID_number='ADM001'
        )
        Admin.objects.create(users=self.admin_user, department='ICT')
        self.admin_token = Token.objects.create(user=self.admin_user)

        self.supervisor_user = CustomUser.objects.create_user(
            username='super1',
            password='pass12345',
            role='supervisor',
            name='Jane Supervisor',
            ID_number='SUP001'
        )
        self.supervisor = Supervisor.objects.create(
            users=self.supervisor_user,
            place_of_work='Main Office',
            department='Engineering',
            staff_ID='STAFF001'
        )
        self.supervisor_token = Token.objects.create(user=self.supervisor_user)

        self.other_supervisor_user = CustomUser.objects.create_user(
            username='super2',
            password='pass12345',
            role='supervisor',
            name='John Supervisor',
            ID_number='SUP002'
        )
        self.other_supervisor = Supervisor.objects.create(
            users=self.other_supervisor_user,
            place_of_work='Branch Office',
            department='Engineering',
            staff_ID='STAFF002'
        )
        self.other_supervisor_token = Token.objects.create(user=self.other_supervisor_user)

        self.student_user = CustomUser.objects.create_user(
            username='student1',
            password='pass12345',
            role='student',
            name='Alice Student',
            ID_number='STD001'
        )
        self.student = Student.objects.create(
            users=self.student_user,
            course_title='Computer Science',
            university_name='Makerere',
            year_of_study=3
        )
        self.student_token = Token.objects.create(user=self.student_user)

    def test_admin_can_assign_supervisor_to_student(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')

        response = self.client.post(
            reverse('assign_supervisor'),
            {'student_id': self.student.id, 'supervisor_id': self.supervisor.id},
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        self.student.refresh_from_db()
        self.assertEqual(self.student.assigned_supervisor, self.supervisor)

    def test_assigned_supervisor_can_review_student_log(self):
        self.student.assigned_supervisor = self.supervisor
        self.student.save()
        weekly_log = WeeklyLog.objects.create(
            user=self.student_user,
            week_number=1,
            description='Worked on the API endpoints.'
        )

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.supervisor_token.key}')
        response = self.client.patch(
            reverse('review_weekly_log', args=[weekly_log.id]),
            {
                'status': 'approved',
                'supervisor_comment': 'Good progress this week.',
                'evaluation_score': 88,
            },
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        weekly_log.refresh_from_db()
        self.assertEqual(weekly_log.status, 'approved')
        self.assertEqual(weekly_log.supervisor, self.supervisor)
        self.assertEqual(weekly_log.evaluation_score, 88)

    def test_unassigned_supervisor_cannot_review_student_log(self):
        self.student.assigned_supervisor = self.supervisor
        self.student.save()
        weekly_log = WeeklyLog.objects.create(
            user=self.student_user,
            week_number=2,
            description='Prepared weekly summary.'
        )

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.other_supervisor_token.key}')
        response = self.client.patch(
            reverse('review_weekly_log', args=[weekly_log.id]),
            {
                'status': 'approved',
                'supervisor_comment': 'Attempted unauthorized review.',
            },
            format='json'
        )

        self.assertEqual(response.status_code, 403)
