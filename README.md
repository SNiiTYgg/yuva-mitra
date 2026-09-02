YuvaMitra --- Hunar Ki Pehchaan

A centralized Academia--Industry Collaboration Portal for Skill
Development, Internships and Placement

Smart India Hackathon 2026
Problem Statement ID: SIH26044
Team Name: TinyBoTs
Category: Software
Theme: Miscellaneous

1. Problem Statement

There is a significant gap between the skills acquired in academic
institutions and the competencies expected by industries.

Students often struggle to identify the skills required for their
desired career paths, while industries face difficulty finding
candidates with suitable skill sets. Academicians also have limited
visibility into industry opportunities that could provide practical
exposure and help align academic learning with current industry
practices.

YuvaMitra is proposed as a unified platform connecting:

Students ↔ Academia ↔ Industry

to support collaboration, skill development, internships and placement.

2. Proposed Solution

YuvaMitra is a centralized platform designed to provide a common
ecosystem for students, industries, academicians and institutions.

The platform is intended to support the complete lifecycle from:

Skill Development
       ↓
Skill Profiling
       ↓
Opportunity Discovery
       ↓
Internship / Placement Application
       ↓
Application Tracking
       ↓
Industry–Academia Collaboration

For the initial MVP, development is intentionally focused on the core
opportunity and application workflow. The broader capabilities described
by the SIH problem statement are planned as progressive extensions.

3. Current MVP

The first version of YuvaMitra focuses on building the core platform
infrastructure.

Student

Google authentication

Student profile

Education and basic information

Skills/interests

Explore internship and placement opportunities

View opportunity details

Apply directly

Track application history

Track application status

Application lifecycle:

Applied
   ↓
Under Review
   ↓
Shortlisted
   ↓
Accepted / Rejected

Industry / Company Provider

Google authentication

Organization profile

Provider registration

Admin approval

Create opportunities

Manage opportunities

View student applications

Update application status

Academia / Institution Provider

Academia is supported as a provider role in the MVP.

Institutions can:

Register as an academic provider

Complete organization profile

Submit for admin approval

Publish relevant opportunities/programs

Manage applications

Admin

There is no public admin signup.

The admin role is provisioned separately and can:

Review provider registration requests

Approve providers

Reject providers with a reason

Monitor providers

Monitor opportunities

4. MVP Workflow

Student Flow

Landing Page
     ↓
Student
     ↓
Continue with Google
     ↓
Supabase Authentication
     ↓
New User?
   ↙       ↘
 YES       NO
 ↓          ↓
Profile   Dashboard
 ↓
Save Profile
 ↓
Dashboard
     ↓
Explore Opportunities
     ↓
Opportunity Details
     ↓
Apply
     ↓
My Applications

Provider Flow

Provider
   ↓
Industry / Academia
   ↓
Google Authentication
   ↓
Organization Profile
   ↓
Admin Approval
   ↓
Provider Dashboard
   ↓
Create Opportunity
   ↓
Manage Applications

5. Planned Platform Capabilities

The SIH problem statement describes a broader platform. These
capabilities form the planned roadmap beyond the initial MVP.

Skill Development

Skill assessment through questionnaires and aptitude tests

Skill profiling

Technical and soft-skill gap identification

Personalized learning recommendations

Certification and industry-relevant training

Career guidance based on skills, interests and industry demand

Student digital portfolios

Internship

Centralized internship opportunities

Skill-based internship matching

Internship application and tracking

Academic/faculty internship opportunities

Industrial training and FDP opportunities

Progress tracking

Mentor feedback

Internship completion records

Placement

Industry job postings

Required qualification and skill information

Opportunity recommendations

Candidate shortlisting

Application and recruitment tracking

Placement analytics and reporting

Industry--Academia Collaboration

Mentorship programs

Workshops

Guest lectures

Innovation challenges

Live industry projects

Consultancy opportunities

Collaborative research

Faculty development opportunities

Institutional Platform

Student skill-development monitoring

Internship participation tracking

Placement progress

Analytics and reporting

Industry skill-demand insights

Future Integrations

The broader solution may later support:

Learning platforms

Certification providers

Institutional databases

Secure document management

Resumes and certificates

Internship reports

Academic records

6. Technical Architecture

Technology Stack

Frontend

React

Vite

Tailwind CSS

React Router

JavaScript / JSX

Backend / Cloud

Supabase Authentication

Supabase PostgreSQL

Supabase Row Level Security (RLS)

High-Level Architecture

                    YuvaMitra
                       │
              ┌────────┴────────┐
              │                 │
           Students          Providers
              │            ┌────┴────┐
              │            │         │
              │         Industry   Academia
              │            │         │
              └────────────┴─────────┘
                       │
                  Opportunities
                       │
                  Applications
                       │
                 Provider Review
                       │
                Application Status
                       │
                    Admin

7. Authentication & Authorization

YuvaMitra uses Supabase Authentication with Google OAuth for students
and providers.

Authentication Flow

Select Account Type
        ↓
Google OAuth
        ↓
Supabase Session
        ↓
Profile Lookup
        ↓
Role / Profile Status
        ↓
Correct Dashboard or Onboarding

The application should not infer roles from email domains.

Roles are stored in the application profile and protected using
database-level authorization.

Roles

Student
Provider → Industry
Provider → Academia
Admin

8. Database

The application uses Supabase PostgreSQL.

Profiles

Stores application-level user and organization information linked to the
Supabase authenticated user.

Typical fields:

id

email

name

role

provider_type

status

phone

institution

course

current_year

graduation_year

skills

organization_name

official_email

contact_person

contact_number

website

description

rejection_reason

created_at

updated_at

Opportunities

Stores internship, placement or other provider-created opportunities.

Typical information:

Title

Role

Description

Location

Work mode

Stipend

Eligibility

Required skills

Application deadline

Selection criteria

Additional instructions

Provider

Status

Applications

Connects students with opportunities.

Typical information:

Student

Opportunity

Provider

Application date

Application status

Updated date

A student should not be able to submit duplicate applications for the
same opportunity.

9. Security

Security is a core requirement of the platform.

YuvaMitra uses:

Supabase Authentication

PostgreSQL Row Level Security

Role-based authorization

Protected frontend routes

Provider approval workflow

Important authorization principles:

Users can access their own profile.

Users cannot promote themselves to admin.

Users cannot approve themselves as providers.

Only approved providers can publish opportunities.

Students can access their own applications.

Students cannot modify application statuses.

Providers can manage applications belonging to their opportunities.

Administrative actions are restricted to authorized admins.

Frontend route guards are used for navigation, while database
permissions are enforced through RLS.

10. Current Scope vs Future Scope

The SIH problem statement describes an extensive ecosystem. YuvaMitra is
being developed incrementally.

Current MVP

Authentication
      ↓
Profile
      ↓
Provider Approval
      ↓
Opportunities
      ↓
Applications
      ↓
Application Tracking

Future Expansion

MVP
 ↓
Skill Assessment
 ↓
Skill Mapping
 ↓
Skill Gap Analysis
 ↓
Opportunity Matching
 ↓
Learning Recommendations
 ↓
Digital Portfolio
 ↓
Analytics & Collaboration

Advanced AI matching, skill assessment, learning recommendations,
built-in examinations and advanced analytics are future extensions,
not features being claimed as fully implemented in the current MVP.

11. Development Approach

YuvaMitra follows a phased development approach.

Phase 1 --- Core MVP

Authentication

Role-based profiles

Provider approval

Opportunity management

Applications

Application tracking

Basic admin management

Phase 2 --- Skill Development

Skill assessment

Skill profiling

Skill-gap identification

Learning recommendations

Phase 3 --- Intelligent Matching

Skill-based opportunity recommendations

Career-oriented matching

Industry skill-demand insights

Phase 4 --- Collaboration & Analytics

Mentorship

Workshops

Live projects

Faculty programs

Institutional dashboards

Analytics

This approach keeps the initial implementation achievable while
providing a clear path toward the complete SIH vision.

12. Local Development

Requirements

Node.js

npm

Supabase project

Installation

npm install

Environment Variables

Create a .env.local file:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Never expose a Supabase service_role key in the frontend.

Run

npm run dev

Use the local URL displayed by Vite.

13. Supabase Configuration

Before testing authentication:

Create the Supabase project.

Enable Google authentication.

Configure Google OAuth credentials.

Configure the application's redirect URL.

Create the required database tables.

Enable Row Level Security.

Configure appropriate RLS policies.

Add required local/production URLs.

After changing .env.local, restart the development server.

14. Demo Mode

For presentations and development, YuvaMitra may provide a separate
frontend-only Demo Mode.

Example demo personas:

Demo Student --- Aarav Sharma

Demo Industry Provider --- TechNova Solutions

Demo Academia Provider --- VJTI Mumbai

Demo Admin --- YuvaMitra Administrator

Demo Mode is separate from real Supabase authentication and should not
write fake presentation data into the real database.

15. Design Philosophy

YuvaMitra is intentionally designed as a focused and practical MVP.

The project prioritizes:

Simple user flows

Clear role separation

Secure authentication

Verified providers

Centralized opportunities

Transparent application tracking

Extensible architecture

The goal is to establish the core digital infrastructure first and
progressively add advanced skill-development and intelligence
capabilities.

16. SIH Alignment

YuvaMitra directly addresses the SIH problem statement by establishing a
common digital platform for the three primary stakeholders:

Stakeholder   MVP Contribution

Students      Profiles, opportunities, applications and tracking
Industry      Opportunities and application management
Academia      Provider participation and opportunity programs
Admin         Provider verification and platform management

The broader SIH requirements are represented in the project's future
roadmap, including skill assessment, skill mapping, learning programs,
matching, collaboration and analytics.

17. Team

TinyBoTs

Project: YuvaMitra
Tagline: Hunar Ki Pehchaan

Built for Smart India Hackathon 2026.

18. Project Status

Current Stage: MVP Development

The current implementation focuses on delivering a functional foundation
for:

Authentication → Profiles → Opportunities → Applications → Application
Tracking

Additional SIH capabilities will be developed progressively after the
core platform is stable.

License

This project is developed by TinyBoTs for Smart India Hackathon
2026.
