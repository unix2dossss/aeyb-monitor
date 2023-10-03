# Albet Eden Youth Board Attendance & Events Monitor

![AEYB Monitor Preview](/marketing/mock/aeybmonitor-card.png)

A modern web application built for the [**Albert-Eden Youth Board**](https://www.albertedenyouth.org.nz/home) to efficiently manage meetings, track attendance, and empower youth-led community initiatives. Developed as part of a [**WDCC Project**](https://wdcc.co.nz/projects), this tool enhances collaboration, accountability, and transparency within youth boards.

## ✨ Features

<details>
<summary>Meeting Management</summary>

- Create, edit & delete meetings with details like type, location, time, and attendees  
- Categorized views for live, upcoming, and past meetings

</details>

<details>
<summary>Attendance Tracking</summary>

- Mark attendance with present/absent status and optional notes  
- View past records for full attendance history

</details>

<details>
<summary>User & Role Management</summary>

- Assign roles (e.g., Admin, Team Leader, Member)  
- Role-based permissions to ensure secure feature access

</details>

<details>
<summary>Calendar Integration</summary>

- Visualize meetings in calendar format using FullCalendar.js  
- Filter meetings by date range

</details>

<details>
<summary>Feedback System</summary>

- Submit feedback, ratings, and comments post-meeting

</details>

<details>
<summary>User Profiles</summary>

- View and update personal roles and permissions

</details>

<details>
<summary>Real-Time Meeting Updates</summary>

- Live meetings are displayed with real-time countdowns and highlights

</details>


## 🛠️ Tech Stack

**Frontend:** React.js · React Router · Axios · Tailwind CSS · FullCalendar.js  
**Backend:** Node.js · Express.js · MongoDB · Mongoose · JWT Auth · Bcrypt.js  
**DevOps & Tools:** Docker · Git · GitHub Actions · ESLint · Prettier · Postman  
**Utilities:** Day.js · Dotenv


## Installation & Setup

1. Make sure to install all the dependencies. This can be done in the root directory by doing `npm run installAll`

2. Run the application 
```bash
# Start the frontend
cd frontend
npm install
npm start

# In a new terminal, start the backend
cd backend
npm install
npm start
```

#### Scripts

`npm run removeModules` - Will remove all npm_modules

`npm run installAll` - Will install all dependencies in the root, frontend, and backend folder.


#### Code Quality

We use **ESLint** for catching code issues and **Prettier** for auto-formatting on save.

To set them up in VSCode:
- Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)


## Contributing

Feel free to fork, improve, and submit pull requests! Contributions are welcome to make AEYB-monitor even more awesome.