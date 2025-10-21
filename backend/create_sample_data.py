# Sample Data Script for Wheeler Knight Portfolio
# This script populates the database with Wheeler Knight's information

from flask import Flask
from models import db
from models.models import User, BlogPost, Skill, Project, Education, WorkExperience, Interest, Analytics, Message, AdminUser
from models.blog_post import PostStatus
from models.skill import SkillCategory
from models.project import ProjectStatus
from models.interest import InterestCategory
from models.message import MessageStatus
from models.admin_user import AdminRole
from datetime import datetime, date
import json

# Create Flask app context
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://wheelerknight:wheelerknight123@mysql:3306/wheelerknight_portfolio'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def create_sample_data():
    """Create sample data for Wheeler Knight's portfolio"""
    
    # Create admin user
    admin = AdminUser(
        username='wheeler',
        email='wheeler@wheelerknight.com',
        password='admin123',  # Change this in production!
        first_name='Wheeler',
        last_name='Knight',
        role=AdminRole.SUPER_ADMIN
    )
    db.session.add(admin)
    
    # Create sample user
    user = User(
        email='visitor@example.com',
        first_name='John',
        last_name='Doe',
        company='Tech Corp',
        job_title='Software Engineer'
    )
    user.newsletter_subscribed = True
    db.session.add(user)
    
    # Create education
    education = Education(
        institution='The University of Alabama',
        degree='Bachelor of Science',
        field_of_study='Management Information Systems',
        gpa=3.2,
        start_date=date(2022, 8, 1),
        end_date=date(2026, 5, 1),
        is_current=True,
        description='Senior year student with Computer Science minor. Focus on data analysis, business intelligence, and software development.',
        achievements='Dean\'s List, MIS Student Association Member, Theta Xi Fraternity Active Member'
    )
    db.session.add(education)
    
    # Create skills
    skills_data = [
        ('Python', SkillCategory.TECHNICAL, 4, 'Backend development, data analysis, automation, Flask/Django frameworks', 'python'),
        ('React', SkillCategory.TECHNICAL, 3, 'Frontend development, component-based architecture, state management', 'react'),
        ('MySQL', SkillCategory.TECHNICAL, 4, 'Database design, queries, optimization, data modeling', 'mysql'),
        ('JavaScript', SkillCategory.TECHNICAL, 3, 'Frontend and backend development, ES6+, Node.js', 'javascript'),
        ('SQL', SkillCategory.TECHNICAL, 4, 'Database queries, data analysis, reporting', 'database'),
        ('Project Management', SkillCategory.SOFT, 4, 'Agile methodologies, team leadership, stakeholder communication', 'project'),
        ('Communication', SkillCategory.SOFT, 5, 'Technical writing, presentations, client relations', 'communication'),
        ('Problem Solving', SkillCategory.SOFT, 4, 'Analytical thinking, debugging, system design', 'problem-solving'),
        ('Spanish', SkillCategory.LANGUAGE, 3, 'Conversational Spanish for business communication', 'language'),
        ('Microsoft Office', SkillCategory.TECHNICAL, 4, 'Excel, PowerPoint, Word, Access for business applications', 'office')
    ]
    
    for name, category, level, description, icon in skills_data:
        skill = Skill(
            name=name,
            category=category,
            proficiency_level=level,
            description=description,
            icon=icon,
            is_featured=level >= 4
        )
        db.session.add(skill)
    
    # Create projects
    projects_data = [
        {
            'title': 'Wheeler Knight Portfolio Website',
            'description': 'Personal portfolio website showcasing skills, projects, and professional experience',
            'long_description': 'A comprehensive portfolio website built with React frontend and Python Flask backend. Features include blog system, project showcase, contact forms, and admin dashboard.',
            'technologies': ['React', 'Python', 'Flask', 'MySQL', 'Docker', 'Mantine UI'],
            'github_url': 'https://github.com/wheelerknight/portfolio',
            'live_url': 'https://wheelerknight.com',
            'status': ProjectStatus.IN_PROGRESS,
            'start_date': date(2024, 10, 1),
            'is_featured': True
        },
        {
            'title': 'Data Analysis Dashboard',
            'description': 'Interactive dashboard for business intelligence and data visualization',
            'long_description': 'Created using Python, Pandas, and Plotly to analyze business metrics and create interactive visualizations for stakeholders.',
            'technologies': ['Python', 'Pandas', 'Plotly', 'SQL', 'Jupyter'],
            'status': ProjectStatus.COMPLETED,
            'start_date': date(2024, 6, 1),
            'end_date': date(2024, 8, 15),
            'is_featured': True
        },
        {
            'title': 'E-commerce Analytics Tool',
            'description': 'Custom analytics solution for tracking e-commerce performance metrics',
            'long_description': 'Developed a comprehensive analytics tool that tracks sales, customer behavior, and inventory metrics with automated reporting.',
            'technologies': ['Python', 'SQL', 'Tableau', 'Excel', 'Power BI'],
            'status': ProjectStatus.COMPLETED,
            'start_date': date(2024, 3, 1),
            'end_date': date(2024, 5, 30),
            'is_featured': False
        }
    ]
    
    for project_data in projects_data:
        project = Project(**project_data)
        db.session.add(project)
    
    # Create work experience
    work_experience = WorkExperience(
        company='University of Alabama',
        position='Student Assistant - IT Department',
        location='Tuscaloosa, AL',
        start_date=date(2023, 9, 1),
        end_date=date(2024, 5, 15),
        description='Provided technical support to faculty and students, maintained computer labs, and assisted with IT projects.',
        achievements='Improved lab efficiency by 20%, received recognition for excellent customer service',
        technologies=['Windows', 'macOS', 'Network Troubleshooting', 'Hardware Repair']
    )
    db.session.add(work_experience)
    
    # Create interests
    interests_data = [
        ('Alabama Crimson Tide', InterestCategory.SPORT, 'College football team - Roll Tide!', True),
        ('Houston Rockets', InterestCategory.SPORT, 'NBA basketball team - Go Rockets!', True),
        ('Cooking', InterestCategory.HOBBY, 'Experimenting with new recipes and cooking techniques', True),
        ('Golf', InterestCategory.HOBBY, 'Weekend golfing and tournaments', True),
        ('Movies', InterestCategory.MOVIE, 'Action, drama, and sci-fi films', False),
        ('Coding', InterestCategory.HOBBY, 'Personal projects and learning new technologies', True),
        ('Hunting & Fishing', InterestCategory.HOBBY, 'Outdoor activities and wildlife', False),
        ('Brownie (My Dog)', InterestCategory.OTHER, '2-year-old lab/terrier mix rescue dog', True)
    ]
    
    for title, category, description, featured in interests_data:
        interest = Interest(
            title=title,
            category=category,
            description=description,
            is_featured=featured
        )
        db.session.add(interest)
    
    # Create sample blog post
    blog_post = BlogPost(
        title='Welcome to My Portfolio!',
        content='Welcome to my personal portfolio website! I\'m Wheeler Knight, a senior at the University of Alabama studying Management Information Systems with a Computer Science minor. This website showcases my journey, skills, and projects as I prepare for a career in data analysis, business intelligence, or software development.\n\nI\'m passionate about using technology to solve business problems and create meaningful solutions. Through my studies and projects, I\'ve developed skills in Python, React, SQL, and various data analysis tools.\n\nFeel free to explore my projects, read about my experiences, and don\'t hesitate to reach out if you\'d like to connect!',
        slug='welcome-to-my-portfolio',
        excerpt='Welcome to my personal portfolio website! Learn about my journey, skills, and projects.'
    )
    blog_post.status = PostStatus.PUBLISHED
    blog_post.published_at = datetime.utcnow()
    db.session.add(blog_post)
    
    # Create sample analytics
    analytics = Analytics.track_page_view(
        page_url='/',
        user_id=user.id,
        ip_address='127.0.0.1',
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        session_id='sample_session_123'
    )
    db.session.add(analytics)
    
    # Create sample message
    message = Message(
        name='Sarah Johnson',
        email='sarah.johnson@company.com',
        subject='Internship Opportunity',
        message='Hi Wheeler,\n\nI came across your portfolio and was impressed by your projects and skills. We have an internship opportunity in our data analytics team that I think would be a great fit for you.\n\nWould you be interested in learning more?\n\nBest regards,\nSarah',
        company='DataCorp Solutions',
        phone='(555) 123-4567'
    )
    db.session.add(message)
    
    # Commit all changes
    db.session.commit()
    print("✅ Sample data created successfully!")

if __name__ == '__main__':
    with app.app_context():
        create_sample_data()
