SalonQueue: Queue-less Salon Management System
SalonQueue is a modern, real-time salon queue management system designed to streamline customer wait times and enhance staff efficiency. SalonQueue allows customers to join salon queues via QR codes or geolocation-based salon selection, receive notifications about their turn, and view estimated wait times. Staff can manage queues, mark service progress, and analyze peak hours and wait times with real-time data.
Features
Customer Features

Join Queue: Scan a QR code or select a salon on a map using the Geolocation API.
Real-Time Notifications: Receive OneSignal push notifications for queue updates and turn alerts.
Estimated Wait Times: View dynamic wait times based on queue position and service duration.

Staff Features

Queue Management: Log in to view and update customer queues, reassign positions, and mark services complete.
Real-Time Data: Leverage Supabase for live queue updates.
Analytics Dashboard: Visualize peak wait times, rush hours, and service popularity with Vue Chart.js.

Tech Stack

Frontend: Vue.js 3, Vite, TypeScript, Tailwind CSS v4, DaisyUI (halloween theme)
Backend: Node.js, Express.js
Database: Supabase (PostgreSQL) with Row-Level Security (RLS)
Notifications: OneSignal
Libraries: 
Frontend: @supabase/supabase-js, qrcode.vue@3, vue-chartjs@5, onesignal-vue3, axios
Backend: @supabase/supabase-js, dotenv, onesignal-node, uuid, cors


Prerequisites

Node.js (v18+)
Supabase account and project
OneSignal account and app
Google Maps API key (for geolocation)

Setup Instructions
1. Clone Repository
git clone <repository-url>
cd SalonQueue

npm run dev


Access at http://localhost:5173.

Usage
Staff

Log in with Akarsh Staff (password: 98765).
View customer queue, update positions, or mark services complete in Staff Dashboard.
Check analytics for peak wait times and rush hours.

Customer

Scan QR code or select salon on map in Landing Page.
Join queue, view position and wait time in Customer Dashboard.
Receive OneSignal notifications for turn updates.

API Endpoints

POST /queue/update-position: Update queue position.
POST /queue/complete: Mark queue entry complete.
GET /analytics: Fetch chart data for staff.
POST /registration/generate-token: Generate QR token.
GET /registration/register: Handle QR registration.

Future Improvements

Implement ML-based wait time predictions.
Add multi-salon support for customers.
Enhance analytics with historical data trends.

Contributors

Shreyas Jha (Backend)
Arafat Ahmad Sheikh (Frontend, Testing)
Akarsh Anand Rai (Testing, Documentation)
