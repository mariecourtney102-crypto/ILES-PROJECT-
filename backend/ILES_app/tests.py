from unittest.mock import patch
from urllib.parse import urlparse
from django.core.cache import cache
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Admin, Company, CustomUser, InternshipPlacement, Student, Supervisor, WeeklyLog


class SupervisorAssignmentFlowTests(APITestCase):
    def setUp(self):
        self.admin_user = CustomUser.objects.create_user(
            username='admin1',
            password='pass12345',
            role='admin',
            name='System Admin',
            ID_number='ADM001',
            email='admin1@example.com'
        )
        Admin.objects.create(users=self.admin_user, department='ICT')
        self.admin_token = Token.objects.create(user=self.admin_user)

        self.supervisor_user = CustomUser.objects.create_user(
            username='super1',
            password='pass12345',
            role='supervisor',
            name='Jane Supervisor',
            ID_number='SUP001',
            email='super1@example.com'
        )
        self.supervisor_company = Company.objects.create(name='Main Office')
        self.supervisor = Supervisor.objects.create(
            users=self.supervisor_user,
            place_of_work=self.supervisor_company,
            department='Engineering',
            staff_ID='STAFF001'
        )
        self.supervisor_token = Token.objects.create(user=self.supervisor_user)

        self.other_supervisor_user = CustomUser.objects.create_user(
            username='super2',
            password='pass12345',
            role='supervisor',
            name='John Supervisor',
            ID_number='SUP002',
            email='super2@example.com'
        )
        self.other_supervisor_company = Company.objects.create(name='Branch Office')
        self.other_supervisor = Supervisor.objects.create(
            users=self.other_supervisor_user,
            place_of_work=self.other_supervisor_company,
            department='Engineering',
            staff_ID='STAFF002'
        )
        self.other_supervisor_token = Token.objects.create(user=self.other_supervisor_user)

        self.student_user = CustomUser.objects.create_user(
            username='student1',
            password='pass12345',
            role='student',
            name='Alice Student',
            ID_number='STD001',
            email='student1@example.com'
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
            student=self.student,
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
            student=self.student,
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

    def test_supervisor_can_view_assigned_student_details(self):
        self.student.assigned_supervisor = self.supervisor
        self.student.save()
        InternshipPlacement.objects.create(
            student=self.student,
            place_of_internship=self.supervisor_company,
            department='Engineering',
            supervisor_name='Ms. Amina',
            start_date='2026-05-01',
            end_date='2026-07-31',
        )

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.supervisor_token.key}')
        response = self.client.get(reverse('supervisor_students'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Alice Student')
        self.assertEqual(response.data[0]['course_title'], 'Computer Science')
        self.assertEqual(response.data[0]['placement']['place_of_internship'], 'Main Office')


class InternshipPlacementTests(APITestCase):
    def setUp(self):
        self.student_user = CustomUser.objects.create_user(
            username='placementstudent',
            password='pass12345',
            role='student',
            name='Placement Student',
            ID_number='STD100',
            email='placementstudent@example.com'
        )
        self.student=Student.objects.create(
            users=self.student_user,
            course_title='Computer Science',
            university_name='Makerere',
            year_of_study=3
        )
        self.student_token = Token.objects.create(user=self.student_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.student_token.key}')

        self.company = Company.objects.create(name='Open Labs')
        self.company2 = Company.objects.create(name='Tech Hub')
    def test_student_can_create_and_fetch_placement(self):
        response = self.client.post(
            reverse('create_placement'),
            {
                'place_of_internship': 'Open Labs',
                'department': 'Engineering',
                'supervisor_name': 'Ms. Amina',
                'start_date': '2026-05-01',
                'end_date': '2026-07-31',
            },
            format='json'
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(InternshipPlacement.objects.filter(student=self.student).count(), 1)

        fetch_response = self.client.get(reverse('get_placement'))
        self.assertEqual(fetch_response.status_code, 200)
        self.assertEqual(fetch_response.data['place_of_internship'], 'Open Labs')

    def test_student_can_update_existing_placement(self):
        InternshipPlacement.objects.create(
            student=self.student,
            place_of_internship=self.company,
            department='Engineering',
            supervisor_name='Ms. Amina',
            start_date='2026-05-01',
            end_date='2026-07-31',
        )

        response = self.client.put(
            reverse('update_placement'),
            {
                'place_of_internship': 'Tech Hub',
                'department': 'Research',
                'supervisor_name': 'Mr. Okello',
                'start_date': '2026-05-15',
                'end_date': '2026-08-15',
            },
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        placement = InternshipPlacement.objects.get(student=self.student)
        self.assertEqual(placement.place_of_internship, 'Tech Hub')
        self.assertEqual(placement.department, 'Research')

    def test_create_placement_updates_existing_record_instead_of_duplicating(self):
        InternshipPlacement.objects.create(
            student=self.student,
            place_of_internship=self.company,
            department='Engineering',
            supervisor_name='Ms. Amina',
            start_date='2026-05-01',
            end_date='2026-07-31',
        )

        response = self.client.post(
            reverse('create_placement'),
            {
                'place_of_internship': 'Tech Hub',
                'department': 'Research',
                'supervisor_name': 'Mr. Okello',
                'start_date': '2026-05-15',
                'end_date': '2026-08-15',
            },
            format='json'
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(InternshipPlacement.objects.filter(user=self.student_user).count(), 1)
        placement = InternshipPlacement.objects.get(user=self.student_user)
        self.assertEqual(placement.place_of_internship, 'Tech Hub')

    def test_placement_rejects_end_date_before_start_date(self):
        response = self.client.post(
            reverse('create_placement'),
            {
                'place_of_internship': 'Open Labs',
                'department': 'Engineering',
                'supervisor_name': 'Ms. Amina',
                'start_date': '2026-08-01',
                'end_date': '2026-07-31',
            },
            format='json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('end_date', response.data)


class EmailVerificationFlowTests(APITestCase):
    def test_signup_creates_active_account_and_allows_login(self):
        signup_payload = {
            "username": "newstudent",
            "name": "New Student",
            "password": "pass12345",
            "role": "student",
            "ID_number": "STD900",
            "telephone_number": "0770000000",
            "email": "newstudent@example.com",
            "course_title": "Computer Science",
            "university_name": "Makerere",
            "year_of_study": 3,
        }

        with patch('ILES_app.views.send_registration_confirmation') as mock_confirmation:
            response = self.client.post(reverse('signup'), signup_payload, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.data['verification_required'])
        self.assertEqual(
            response.data['message'],
            'Account created successfully. You can log in right away.'
        )
        self.assertEqual(CustomUser.objects.filter(username='newstudent').count(), 1)

        user = CustomUser.objects.get(username='newstudent')
        self.assertTrue(user.is_verified)
        self.assertIsNotNone(user.email_verified_at)
        mock_confirmation.assert_called_once()

        login_response = self.client.post(
            reverse('login'),
            {"username": "newstudent", "password": "pass12345"},
            format='json'
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('token', login_response.data)
        self.assertEqual(login_response.data['role'], 'student')

    def test_supervisor_signup_creates_company_and_allows_login(self):
        signup_payload = {
            "username": "newsupervisor",
            "name": "New Supervisor",
            "password": "pass12345",
            "role": "supervisor",
            "ID_number": "SUP900",
            "telephone_number": "0770000003",
            "email": "newsupervisor@example.com",
            "place_of_work": "Open Labs",
            "department": "Engineering",
            "staff_ID": "STAFF900",
        }

        with patch('ILES_app.views.send_registration_confirmation') as mock_confirmation:
            response = self.client.post(reverse('signup'), signup_payload, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.data['verification_required'])
        self.assertEqual(CustomUser.objects.filter(username='newsupervisor').count(), 1)
        self.assertTrue(Company.objects.filter(name='Open Labs').exists())

        user = CustomUser.objects.get(username='newsupervisor')
        self.assertTrue(user.is_verified)
        mock_confirmation.assert_called_once()

        login_response = self.client.post(
            reverse('login'),
            {"username": "newsupervisor", "password": "pass12345"},
            format='json'
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.data['role'], 'supervisor')

    def test_signup_rejects_duplicate_email(self):
        CustomUser.objects.create_user(
            username='existinguser',
            password='pass12345',
            role='student',
            name='Existing User',
            ID_number='STD9010',
            email='paul@gmail.com',
        )

        signup_payload = {
            "username": "anotherstudent",
            "name": "Another Student",
            "password": "pass12345",
            "role": "student",
            "ID_number": "STD9011",
            "telephone_number": "0770000001",
            "email": "paul@gmail.com",
            "course_title": "Computer Science",
            "university_name": "Makerere",
            "year_of_study": 3,
        }

        response = self.client.post(reverse('signup'), signup_payload, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn('email', response.data)
        self.assertEqual(
            response.data['email'][0],
            'A user with this email already exists.'
        )


class AdminAccessControlTests(APITestCase):
    def setUp(self):
        self.student_user = CustomUser.objects.create_user(
            username='student-admin-check',
            password='pass12345',
            role='student',
            name='Student User',
            ID_number='STD901',
            email='student-admin-check@example.com',
        )
        Student.objects.create(
            users=self.student_user,
            course_title='Computer Science',
            university_name='Makerere',
            year_of_study=3
        )
        self.student_token = Token.objects.create(user=self.student_user)

    def test_non_admin_cannot_access_admin_endpoints(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.student_token.key}')

        response = self.client.get(reverse('list_students'))

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.data['error'],
            'You do not have permission to perform this action.'
        )
