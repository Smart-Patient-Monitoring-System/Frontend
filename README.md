# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Doctor Patient View - Restructured Implementation

## Overview

This restructured implementation matches the screenshot design with a cleaner Overview tab and better organization of features into separate tabs.

## Key Changes

### 1. **Simplified Overview Tab**
The Overview tab now shows only:
- **4 Vital Cards** (Heart Rate, Temperature, SPO₂, Blood Pressure) in a 2x2 grid
- **Vital Trends Graph** (Last 24h visualization)
- **Doctor's Notes Card** (with note history and input)
- **Assigned Care Team Card** (showing care team members)

### 2. **New Dedicated Tabs**
Other features are now organized into separate tabs:
- **Real-Time Vitals**: Live vital monitoring graphs
- **ECG Readings**: Full-page ECG monitor
- **Medical Records**: Reports and Medications
- **Health Insights**: Health Risk and Tips
- **Appointments**: Appointment scheduling (removed from Overview)
- **Emergency Panel**: Emergency features
- **Messaging**: Communication dashboard
- **Profile**: Patient profile
- **AI Health Assistant**: Full-screen chatbot

### 3. **New Components Created**

#### `DoctorNotesCard.jsx`
A comprehensive notes management component featuring:
- **Note Types**: Clinical Observation, Follow-up Required, Note
- **Color-coded badges** for different note types
- **Timestamp display**
- **Author attribution**
- **New note input** with textarea
- **Attachment button** for future file uploads
- **Save Note button** with icon

**Features:**
- Scrollable notes list with max-height
- Styled note input area with gray background
- Responsive design
- Hover effects and transitions

#### `AssignedCareTeamCard.jsx`
A dark-themed care team display featuring:
- **Gradient dark background** (gray-900 to gray-800)
- **Team member cards** with avatars
- **Online status indicators** (green dot)
- **Message buttons** for quick communication
- **Users icon** in header with red accent

**Features:**
- Compact, professional design
- Hover effects on team member cards
- Status indicators for availability
- Quick message access

## File Structure

```
components/PatientPortal/
├── DoctorNotesCard.jsx          (NEW)
├── AssignedCareTeamCard.jsx     (NEW)
├── Header.jsx
├── PatientInfoCard.jsx
├── VitalCard.jsx
├── GraphCard.jsx
├── Dashboard.jsx
├── RealtimeGraphs.jsx
├── ECGMonitor.jsx
├── ReportsCard.jsx
├── MedicationsCard.jsx
├── HealthRiskCard.jsx
├── HealthTipsCard.jsx
├── AppointmentsCard.jsx
├── EmergencyPanel.jsx
├── EmergencyCard.jsx
├── MessagingDashboard.jsx
├── ProfileTab.jsx
├── FloatingChatbot.jsx
└── ManualEntryForm.jsx

pages/doctor/
└── DoctorPatientView.jsx         (UPDATED)
```

## Installation Instructions

### Step 1: Copy New Components
Copy these two new components to your project:

```bash
# Copy DoctorNotesCard
cp DoctorNotesCard.jsx src/components/PatientPortal/

# Copy AssignedCareTeamCard
cp AssignedCareTeamCard.jsx src/components/PatientPortal/
```

### Step 2: Update Main View
Replace your existing `DoctorPatientView.jsx` with the updated version:

```bash
cp DoctorPatientView.jsx src/pages/doctor/
```

### Step 3: Update Dashboard Component
Ensure your `Dashboard.jsx` component includes these tabs:

```javascript
const tabs = [
  "Overview",
  "Real-Time Vitals",
  "ECG Readings",
  "Medical Records",
  "Health Insights",
  "Appointments",
  "Emergency Panel",
  "Messaging",
  "Profile",
  "AI Health Assistant"
];
```

## Layout Breakdown

### Overview Tab Layout (Desktop)

```
┌─────────────────────────────────────┬──────────────────┐
│                                     │                  │
│  ┌──────────┬──────────┐           │  Doctor's Notes  │
│  │  Heart   │   Temp   │           │                  │
│  │  Rate    │          │           │  ┌────────────┐  │
│  └──────────┴──────────┘           │  │ Notes List │  │
│  ┌──────────┬──────────┐           │  └────────────┘  │
│  │   SPO₂   │  Blood   │           │                  │
│  │          │ Pressure │           │  [New Note Area] │
│  └──────────┴──────────┘           │                  │
│                                     ├──────────────────┤
│  ┌────────────────────────────────┐ │                  │
│  │                                │ │  Assigned Care   │
│  │   Vital Trends (Last 24h)     │ │      Team        │
│  │         (Graph)                │ │                  │
│  │                                │ │  ┌────────────┐  │
│  └────────────────────────────────┘ │  │ Dr. Miller │  │
│                                     │  │    Nurse   │  │
│                                     │  └────────────┘  │
└─────────────────────────────────────┴──────────────────┘
       (2/3 width)                        (1/3 width)
```

### Responsive Breakpoints

- **Mobile** (`< 640px`): All cards stack vertically
- **Small Mobile** (`> 480px`): Vital cards in 2 columns
- **Tablet** (`> 768px`): Maintains 2-column vital grid
- **Desktop** (`> 1024px`): 
  - Left column (2/3): Vitals + Graph
  - Right column (1/3): Notes + Care Team

## Component Props

### DoctorNotesCard
```jsx
<DoctorNotesCard />
// No props required - uses internal state
// Customize the notes array inside the component
```

### AssignedCareTeamCard
```jsx
<AssignedCareTeamCard />
// No props required - uses internal state
// Customize the careTeam array inside the component
```

## Customization Guide

### Adding More Note Types
In `DoctorNotesCard.jsx`, update the `getTypeStyles` function:

```javascript
const getTypeStyles = (type) => {
  switch (type) {
    case "CLINICAL OBSERVATION":
      return "text-blue-600 bg-blue-50";
    case "FOLLOW-UP REQUIRED":
      return "text-orange-600 bg-orange-50";
    case "URGENT":
      return "text-red-600 bg-red-50";
    case "NOTE":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};
```

### Adding More Care Team Members
In `AssignedCareTeamCard.jsx`, update the `careTeam` array:

```javascript
const careTeam = [
  {
    id: 1,
    name: "Dr. Miller",
    role: "Lead Physician",
    avatar: "https://i.pravatar.cc/150?img=33",
    status: "online",
  },
  // Add more team members...
];
```

### Connecting to Backend
Replace the static data with API calls:

```javascript
// In DoctorNotesCard.jsx
useEffect(() => {
  fetchNotes().then(data => setNotes(data));
}, []);

const handleSaveNote = async () => {
  if (newNote.trim()) {
    await saveNote({ content: newNote, type: "NOTE" });
    setNewNote("");
    // Refresh notes list
  }
};

// In AssignedCareTeamCard.jsx
useEffect(() => {
  fetchCareTeam().then(data => setCareTeam(data));
}, []);
```

## Dependencies

Make sure these packages are installed:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "lucide-react": "^0.263.0"
  }
}
```

Install if missing:
```bash
npm install lucide-react
```

## Icons Used

From `lucide-react`:
- `MessageSquare` - Notes icon and save button
- `Paperclip` - Attachment button
- `Users` - Care team header
- `MessageCircle` - Message team member button
- `Send` - (Available for future use)

## Color Scheme

### Doctor's Notes Card
- Background: White (`bg-white`)
- Border: Gray-200 (`border-gray-200`)
- Input area: Gray-50 (`bg-gray-50`)
- Primary button: Blue-600 (`bg-blue-600`)

### Note Type Colors
- Clinical Observation: Blue (`text-blue-600 bg-blue-50`)
- Follow-up Required: Orange (`text-orange-600 bg-orange-50`)
- Note: Gray (`text-gray-600 bg-gray-50`)

### Assigned Care Team Card
- Background: Dark gradient (`from-gray-900 to-gray-800`)
- Accent: Red-400 for icon (`text-red-400`)
- Online status: Green-500 (`bg-green-500`)
- Card hover: Gray-800 (`hover:bg-gray-800`)

## Additional Features to Implement

### 1. Note Actions
Add edit and delete functionality:
```jsx
<button onClick={() => handleEditNote(note.id)}>Edit</button>
<button onClick={() => handleDeleteNote(note.id)}>Delete</button>
```

### 2. Note Filtering
Add filter dropdown for note types:
```jsx
<select onChange={(e) => setFilterType(e.target.value)}>
  <option value="all">All Notes</option>
  <option value="CLINICAL OBSERVATION">Clinical</option>
  <option value="FOLLOW-UP REQUIRED">Follow-up</option>
</select>
```

### 3. Care Team Actions
Add more interaction options:
```jsx
<button onClick={() => handleVideoCall(member.id)}>Video Call</button>
<button onClick={() => handleViewSchedule(member.id)}>Schedule</button>
```

### 4. Real-time Updates
Implement WebSocket for live updates:
```jsx
useEffect(() => {
  const ws = new WebSocket('ws://your-server.com/notes');
  ws.onmessage = (event) => {
    const newNote = JSON.parse(event.data);
    setNotes(prev => [newNote, ...prev]);
  };
  return () => ws.close();
}, []);
```

## Troubleshooting

### Issue: Cards not displaying
- Verify all component imports are correct
- Check that the components are exported as default
- Ensure Tailwind CSS is properly configured

### Issue: Icons not showing
- Install lucide-react: `npm install lucide-react`
- Verify imports at the top of each component

### Issue: Layout breaking on mobile
- Check that all responsive classes are present (`sm:`, `md:`, `lg:`)
- Verify Tailwind's responsive breakpoints in your config

### Issue: Notes not saving
- Check console for errors
- Verify the `handleSaveNote` function is being called
- Implement proper API integration

## Next Steps

1. **Connect to Backend API**
   - Implement actual data fetching
   - Add authentication
   - Handle loading states and errors

2. **Add More Features**
   - Note editing and deletion
   - File attachments for notes
   - Rich text editor for notes
   - Care team scheduling
   - Video call integration

3. **Enhance UX**
   - Add loading skeletons
   - Implement toast notifications
   - Add confirmation dialogs
   - Improve error handling

4. **Testing**
   - Add unit tests for components
   - Test responsive behavior
   - Test with real data
   - Accessibility testing

## Support

For questions or issues with this implementation, please refer to:
- React documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev