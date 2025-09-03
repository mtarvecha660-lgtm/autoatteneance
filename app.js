// --- LOCAL DATABASE SIMULATION ---
const localDB = {
    users: {},
    timetable: {},
    attendance: {},
    activeQrTokens: {},
    events: []
};

// --- CONFIG ---
const GEMINI_API_KEY = null;

// --- MOCK DATA SETUP ---
function setupInitialData() {
    localDB.users = {
        'student1': { username: 'a', password: '123', name: 'Alice Johnson', role: 'student', profile: { interests: ['Web Development', 'AI'], goals: ['Build a portfolio website', 'Learn advanced CSS animations'] } },
        'student2': { username: 'b', password: '123', name: 'Bob Williams', role: 'student', profile: { interests: ['Data Science'], goals: ['Learn Python for data analysis'] } },
        'teacher1': { username: 'dr', password: 'pass', name: 'Dr. Evelyn Reed', role: 'teacher' },
        'admin1': { username: 'admin', password: 'pass', name: 'Principal Smith', role: 'admin' },
        'eventmgr1': { username: 'eventmgr', password: 'pass', name: 'Chris Green', role: 'event-manager' }
    };
    // Inside setupInitialData() function
localDB.timetable = {
    classes: [
        { classId: 'CS101', subject: 'Intro to CompSci', teacherId: 'teacher1', students: ['student1', 'student2'], time: '09:00 - 10:30' },
        { classId: 'MA202', subject: 'Calculus II', teacherId: 'teacher1', students: ['student1', 'student2'], time: '11:30 - 13:00' }
    ]
};
    
    // Sample Events for testing
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    localDB.events = [
        { id: 'evt-1', title: 'Annual Tech Symposium', date: yesterday.toISOString().split('T')[0], startTime: '10:00', endTime: '16:00', location: 'Main Auditorium', organizer: 'Tech Club', description: 'A full day of talks and workshops from industry experts on the latest trends in technology.' },
        { id: 'evt-2', title: 'Guest Lecture: AI Ethics', date: today.toISOString().split('T')[0], startTime: '14:00', endTime: '15:30', location: 'Hall C', organizer: 'Philosophy Dept.', description: 'Join us for an insightful lecture on the ethical implications of artificial intelligence with guest speaker Dr. Anya Sharma.' },
        { id: 'evt-3', title: 'Startup Pitch Night', date: tomorrow.toISOString().split('T')[0], startTime: '18:00', endTime: '20:00', location: 'Innovation Hub', organizer: 'Entrepreneurship Cell', description: 'Watch students pitch their innovative startup ideas to a panel of judges. Networking session to follow.' },
    ];
    
    localDB.attendance = {};
    localDB.activeQrTokens = {};
}

// --- GLOBAL STATE & UI HELPERS ---
let currentUser = null;
let html5QrCode = null;

function showView(viewId) {
    const currentActive = document.querySelector('.active-view');
    if (currentActive) {
        currentActive.classList.remove('active-view');
        setTimeout(() => { if (!currentActive.classList.contains('active-view')) currentActive.style.display = 'none'; }, 500);
    }
    const view = document.getElementById(viewId);
    if (view) {
        const displayStyle = ['student-view', 'teacher-view', 'admin-view', 'event-manager-view'].includes(viewId) ? 'flex' : 'block';
        view.style.display = displayStyle;
        setTimeout(() => view.classList.add('active-view'), 10);
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    toastMessage.textContent = message;
    toast.classList.remove('hidden', 'bg-green-500', 'bg-red-500', 'opacity-0', 'translate-y-4');

    if (type === 'success') {
        toast.classList.add('bg-green-500');
        toastIcon.textContent = '✔️';
    } else {
        toast.classList.add('bg-red-500');
        toastIcon.textContent = '✖️';
    }
    
    let toastTimeout = null;
    if (toastTimeout) clearTimeout(toastTimeout);
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-4');
    }, 10);

    toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// --- LOCAL LOGIN LOGIC ---
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginErrorEl = document.getElementById('login-error');
    loginErrorEl.textContent = '';

    // Find the user entry in the localDB object
    const userEntry = Object.entries(localDB.users).find(([id, user]) => user.username === username);

    if (userEntry) {
        const [userId, user] = userEntry;
        if (user.password === password) {
            // Success! Set the currentUser object with the local data
            currentUser = { id: userId, ...user };
            loadDashboard(currentUser.role);
        } else {
            loginErrorEl.textContent = 'Incorrect password.';
        }
    } else {
        loginErrorEl.textContent = 'Username not found.';
    }
});




function loadDashboard(role) {
    switch (role) {
        case 'student': renderStudentDashboard(); break;
        case 'teacher': renderTeacherDashboard(); break;
        case 'admin': renderAdminDashboard(); break;
        case 'event-manager': renderEventManagerDashboard(); break;
    }
}


// --- GEMINI API (Placeholder) ---
async function callGeminiAPI(prompt) {
     console.warn("GEMINI_API_KEY not set. Returning mock response.");
     if (prompt.toLowerCase().includes("act as a helpful academic advisor")) {
         return `1. **Mini Project:** Build a 1-hour mini portfolio page.\n2. **Data Exercise:** Analyze a small dataset.\n3. **Skill Sprint:** Follow a 20-minute tutorial on a new tool.`;
     }
     if (prompt.toLowerCase().includes("break down this large goal")) {
         return `1. Identify the core outcome.\n2. Research 3 example projects.\n3. Outline milestones.\n4. Gather resources.\n5. Execute the first small milestone.`;
     }
     return "AI feature is not configured.";
}

// --- STUDENT DASHBOARD ---
function renderStudentDashboard() {
    document.getElementById('student-name').textContent = currentUser.name;
    // **FIXED HERE**: The following lines were missing
    renderStudentSchedule();
    renderStudentGoals();
    document.getElementById('tasks-output').innerHTML = '';
    // End of fix
    renderStudentEvents();
    showView('student-view');
}

function renderStudentSchedule() {
    const scheduleEl = document.getElementById('student-schedule');
    scheduleEl.innerHTML = '';
    const studentClasses = localDB.timetable.classes.filter(cls => cls.students.includes(currentUser.id));

    if (studentClasses.length === 0) {
         scheduleEl.innerHTML = `<p class="text-sm text-gray-400">You are not enrolled in any classes today.</p>`;
         return;
    }

    studentClasses.forEach(cls => {
        const isFreePeriod = cls.subject === 'Free Period';
        const card = document.createElement('div');
        card.className = `p-4 rounded-lg flex justify-between items-center bg-white/5 border-l-4 ${isFreePeriod ? 'border-amber-400' : 'border-blue-400'}`;
        card.innerHTML = `
            <div>
                <p class="font-bold text-white">${cls.subject}</p>
                <p class="text-sm text-gray-300">${cls.time}</p>
            </div>
            ${!isFreePeriod ? `<button data-class-id="${cls.classId}" class="scan-qr-btn btn btn-primary text-sm">Mark Attendance</button>` : '<span class="text-sm font-semibold text-amber-400">Free Period</span>'}
        `;
        scheduleEl.appendChild(card);
    });
}

function renderStudentGoals() {
    const goalsEl = document.getElementById('student-goals');
    goalsEl.innerHTML = '';
    if (currentUser.profile && currentUser.profile.goals && currentUser.profile.goals.length > 0) {
        currentUser.profile.goals.forEach(goal => {
            const goalEl = document.createElement('div');
            goalEl.className = 'bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center';
            goalEl.innerHTML = `
                <p class="text-sm font-medium text-gray-200">${goal}</p>
                <button data-goal="${goal}" class="breakdown-goal-btn text-xs bg-fuchsia-500/20 text-fuchsia-300 font-semibold px-2 py-1 rounded-md hover:bg-fuchsia-500/40 transition-colors">✨ Break down</button>
            `;
            goalsEl.appendChild(goalEl);
        });
    } else {
        goalsEl.innerHTML = `<p class="text-sm text-gray-400">No goals set yet.</p>`;
    }
}

function renderStudentEvents() {
    const ongoingContainer = document.getElementById('ongoing-events');
    const upcomingContainer = document.getElementById('upcoming-events');
    const pastContainer = document.getElementById('past-events');
    [ongoingContainer, upcomingContainer, pastContainer].forEach(c => c.innerHTML = '');

    const now = new Date();
    let hasOngoing = false, hasUpcoming = false, hasPast = false;

    localDB.events.forEach(event => {
        const eventStart = new Date(`${event.date}T${event.startTime}`);
        const eventEnd = new Date(`${event.date}T${event.endTime}`);
        
        const eventEl = document.createElement('button');
        eventEl.className = 'w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex justify-between items-center';
        eventEl.dataset.eventId = event.id;
        eventEl.innerHTML = `
            <div>
                <p class="font-semibold text-white">${event.title}</p>
                <p class="text-sm text-gray-300">${new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <span class="text-xs font-bold text-gray-400">></span>
        `;

        if (now >= eventStart && now <= eventEnd) {
            ongoingContainer.appendChild(eventEl);
            hasOngoing = true;
        } else if (now < eventStart) {
            upcomingContainer.appendChild(eventEl);
            hasUpcoming = true;
        } else {
            pastContainer.appendChild(eventEl);
            hasPast = true;
        }
    });

    if (!hasOngoing) ongoingContainer.innerHTML = `<p class="text-sm text-gray-400">No events currently ongoing.</p>`;
    if (!hasUpcoming) upcomingContainer.innerHTML = `<p class="text-sm text-gray-400">No upcoming events scheduled.</p>`;
    if (!hasPast) pastContainer.innerHTML = `<p class="text-sm text-gray-400">No past events found.</p>`;
}

document.getElementById('student-events-section').addEventListener('click', e => {
    const eventButton = e.target.closest('button[data-event-id]');
    if (eventButton) {
        const eventId = eventButton.dataset.eventId;
        const event = localDB.events.find(ev => ev.id === eventId);
        if (event) showEventDetails(event);
    }
});

document.getElementById('student-schedule').addEventListener('click', (e) => {
    const button = e.target.closest('.scan-qr-btn');
    if (button) {
        const classId = button.dataset.classId;
        startScanner(classId);
    }
});

document.getElementById('student-goals').addEventListener('click', (e) => {
     const button = e.target.closest('.breakdown-goal-btn');
    if (button) {
        const goal = button.dataset.goal;
        breakDownGoal(goal);
    }
});

document.getElementById('generate-tasks-btn').addEventListener('click', async () => {
    const loader = document.getElementById('tasks-loader');
    const output = document.getElementById('tasks-output');
    const btn = document.getElementById('generate-tasks-btn');
    
    loader.classList.remove('hidden');
    output.innerHTML = '';
    btn.disabled = true;

    const interests = currentUser.profile.interests.join(', ');
    const goals = currentUser.profile.goals.join(', ');
    const prompt = `Act as a helpful academic advisor. For a student interested in "${interests}" with long-term goals like "${goals}", suggest 3 specific, actionable, and creative tasks they can complete in a 1-hour free period. Format as a numbered list with bold headings.`;
    
    const result = await callGeminiAPI(prompt);
    
    const formatted = result
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-fuchsia-300">$1</strong>')
        .replace(/\n/g, '<br>');
    output.innerHTML = `<div class="prose text-gray-300">${formatted}</div>`;
    loader.classList.add('hidden');
    btn.disabled = false;
});

function showEventDetails(event) {
    document.getElementById('event-modal-title').textContent = event.title;
    const eventDate = new Date(`${event.date}T00:00:00`);
    document.getElementById('event-modal-date').textContent = eventDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('event-modal-time').textContent = `${event.startTime} - ${event.endTime}`;
    document.getElementById('event-modal-location').textContent = event.location;
    document.getElementById('event-modal-organizer').textContent = event.organizer;
    document.getElementById('event-modal-description').textContent = event.description;
    document.getElementById('event-details-modal').classList.remove('hidden');
}

async function breakDownGoal(goal) {
    const modal = document.getElementById('goal-modal');
    const loader = document.getElementById('goal-modal-loader');
    const content = document.getElementById('goal-modal-content');
    
    modal.classList.remove('hidden');
    loader.classList.remove('hidden');
    content.innerHTML = '';
    document.getElementById('goal-modal-title').textContent = `Breaking down: "${goal}"`;

    const prompt = `Break down this large goal: "${goal}" into 5 smaller, manageable steps for a student. Provide a simple numbered list.`;
    const result = await callGeminiAPI(prompt);
    
    const formattedResult = result.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
        return `<div class="flex items-start gap-3 mt-2">
                    <span class="flex-shrink-0 bg-fuchsia-500/30 text-fuchsia-200 font-bold w-6 h-6 text-sm rounded-full flex items-center justify-center">${line.split('.')[0]}</span>
                    <p>${line.replace(/^\d+\.\s*/, '')}</p>
                </div>`;
    }).join('');

    content.innerHTML = formattedResult;
    loader.classList.add('hidden');
}

async function startScanner(targetClassId) {
    const modal = document.getElementById('scanner-modal');
    modal.classList.remove('hidden');

    if (html5QrCode && html5QrCode.isScanning) {
        try { await html5QrCode.stop(); } catch (err) { /* ignore */ }
    }

    html5QrCode = new Html5Qrcode("qr-reader");

    const onScanSuccess = (decodedText) => {
        try {
            const data = JSON.parse(decodedText);
            if (data.classId && data.classId === targetClassId && data.token) {
                html5QrCode.stop().then(() => {
                    modal.classList.add('hidden');
                    markAttendance(currentUser.id, data.classId);
                });
            } else if (data.classId !== targetClassId) {
                showToast('Incorrect QR Code for this class.', 'error');
            } else {
                showToast('This QR code is invalid or expired.', 'error');
            }
        } catch (e) {
            showToast("Invalid QR Code format.", 'error');
        }
    };

    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, onScanSuccess, (err) => {})
        .catch(() => {
            showToast('Could not start camera. Please grant permissions.', 'error');
            modal.classList.add('hidden');
        });
}

// New function to mark attendance in Firestore
function markAttendance(studentId, classId) {
    const today = new Date().toISOString().split('T')[0];
    // Create a unique document ID, e.g., "2025-09-03_CS101"
    const attendanceDocId = `${today}_${classId}`;
    
    // Get a reference to the document in Firestore
    const attendanceRef = db.collection('attendance').doc(attendanceDocId);

    // Set or update the student's status in that document
    attendanceRef.set({
        [studentId]: 'present' // e.g., { student1: 'present' }
    }, { merge: true }) // 'merge: true' adds the student without overwriting others
    .then(() => {
        showToast('Attendance marked successfully!');
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        showToast('Failed to mark attendance.', 'error');
    });
}

// --- TEACHER & ADMIN DASHBOARDS ---
function renderTeacherDashboard() {
    document.getElementById('teacher-name').textContent = currentUser.name;
    const classSelect = document.getElementById('class-select');
    classSelect.innerHTML = '';

    const classes = localDB.timetable.classes.filter(c => c.teacherId === currentUser.id);
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.classId;
        option.textContent = `${cls.classId} - ${cls.subject}`;
        classSelect.appendChild(option);
    });

    if (classes.length > 0) {
        loadAttendanceForClass(classes[0].classId);
    } else {
        document.getElementById('attendance-grid').innerHTML = '<p class="text-sm text-gray-400 col-span-full">No classes assigned.</p>';
    }
    
    classSelect.onchange = (e) => loadAttendanceForClass(e.target.value);
    document.getElementById('generate-qr-btn').onclick = generateQrCode;
    showView('teacher-view');
}

// Global variable to "unsubscribe" from the listener when the view changes
let attendanceUnsubscribe = null;

function loadAttendanceForClass(classId) {
    const attendanceGrid = document.getElementById('attendance-grid');
    const classInfo = localDB.timetable.classes.find(c => c.classId === classId); // You can still get student list locally for this demo
    
    // If we are already listening to a class, stop it before starting a new one
    if (attendanceUnsubscribe) {
        attendanceUnsubscribe();
    }

    const today = new Date().toISOString().split('T')[0];
    const attendanceDocId = `${today}_${classId}`;
    const attendanceRef = db.collection('attendance').doc(attendanceDocId);

    // --- REAL-TIME LISTENER ---
    // This function will be called immediately with the current data
    // and then again every time the data changes.
    attendanceUnsubscribe = attendanceRef.onSnapshot((doc) => {
        const attendanceData = doc.exists ? doc.data() : {};
        console.log("Received real-time update:", attendanceData);
        
        attendanceGrid.innerHTML = ''; // Clear the grid before re-rendering
        
        classInfo.students.forEach(studentId => {
            const studentData = localDB.users[studentId]; // Get student info
            if (studentData) {
                // Check if the student's ID exists in the attendance data
                const isPresent = attendanceData[studentId] === 'present';
                
                const studentCard = document.createElement('div');
                studentCard.className = 'p-3 rounded-lg border border-white/10 flex items-center space-x-3 bg-white/5';
                studentCard.innerHTML = `
                    <span class="status-dot ${isPresent ? 'status-present' : 'status-absent'}"></span>
                    <div>
                        <p class="font-semibold text-sm text-white">${studentData.name}</p>
                        <p class="text-xs text-gray-400">${studentId}</p>
                    </div>
                `;
                attendanceGrid.appendChild(studentCard);
            }
        });
    });
}

function generateQrCode() {
    const classId = document.getElementById('class-select').value;
    if (!classId) {
        showToast("Please select a class first.", "error");
        return;
    }
    const token = `${classId}-${Date.now()}`;
    const qrData = JSON.stringify({ classId: classId, token: token });

    QRCode.toCanvas(document.getElementById('qrcode'), qrData, { width: 220, margin: 1 }, (error) => {
        if (error) {
            showToast('Failed to generate QR code.', 'error');
            return;
        }
        document.getElementById('qr-modal-class-info').textContent = `For class: ${classId}`;
        document.getElementById('qr-modal').classList.remove('hidden');
    });
}

function renderAdminDashboard() {
    document.getElementById('admin-name').textContent = currentUser.name;
    let studentCount = 0, teacherCount = 0;
    Object.values(localDB.users).forEach(user => {
        if (user.role === 'student') studentCount++;
        if (user.role === 'teacher') teacherCount++;
    });
    
    const today = new Date().toISOString().split('T')[0];
    const presentCount = Object.values(localDB.attendance).filter(a => a.date === today && a.status === 'present').length;
    const totalPossibleAttendances = localDB.timetable.classes.reduce((sum, c) => sum + (c.students?.length || 0), 0);
    const attendancePercentage = totalPossibleAttendances > 0 ? ((presentCount / totalPossibleAttendances) * 100).toFixed(1) : 0;

    document.getElementById('total-students').textContent = studentCount;
    document.getElementById('total-teachers').textContent = teacherCount;
    document.getElementById('overall-attendance').textContent = `${attendancePercentage}%`;

    showView('admin-view');
}

// --- EVENT MANAGER DASHBOARD ---
function renderEventManagerDashboard() {
    document.getElementById('event-manager-name').textContent = currentUser.name;
    renderEventManagerEvents();
    showView('event-manager-view');
}

function renderEventManagerEvents() {
    const listContainer = document.getElementById('event-list-manager');
    listContainer.innerHTML = '';
    if (localDB.events.length === 0) {
         listContainer.innerHTML = `<p class="text-sm text-gray-400">No events created yet.</p>`;
         return;
    }
    localDB.events
        .sort((a,b) => new Date(b.date) - new Date(a.date))
        .forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = 'p-3 rounded-lg bg-white/5 border border-white/10';
            eventEl.innerHTML = `
                <p class="font-semibold text-white">${event.title}</p>
                <p class="text-sm text-gray-300">${new Date(event.date + 'T00:00:00').toLocaleDateString()} at ${event.startTime}</p>
            `;
            listContainer.appendChild(eventEl);
    });
}

document.getElementById('create-event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newEvent = {
        id: `evt-${Date.now()}`,
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        startTime: document.getElementById('event-start-time').value,
        endTime: document.getElementById('event-end-time').value,
        location: document.getElementById('event-location').value,
        organizer: document.getElementById('event-organizer').value,
        description: document.getElementById('event-description').value,
    };

    localDB.events.push(newEvent);
    localStorage.setItem('eventData', JSON.stringify(localDB.events));
    
    showToast('Event created successfully!', 'success');
    document.getElementById('create-event-form').reset();
    renderEventManagerEvents();
});

// --- MODAL CLOSE HANDLERS ---
document.getElementById('close-qr-modal').addEventListener('click', () => document.getElementById('qr-modal').classList.add('hidden'));
document.getElementById('close-goal-modal').addEventListener('click', () => document.getElementById('goal-modal').classList.add('hidden'));
document.getElementById('close-event-modal').addEventListener('click', () => document.getElementById('event-details-modal').classList.add('hidden'));
document.getElementById('close-scanner-modal').addEventListener('click', async () => {
    if (html5QrCode && html5QrCode.isScanning) {
        try { await html5QrCode.stop(); } catch (err) {}
    }
    document.getElementById('scanner-modal').classList.add('hidden');
});

// --- INITIALIZE THE APP ---
function initializeApp() {
    setupInitialData();
    
    const savedAttendance = localStorage.getItem('attendanceData');
    if (savedAttendance) localDB.attendance = JSON.parse(savedAttendance);
    
    const savedEvents = localStorage.getItem('eventData');
    if (savedEvents) {
         localDB.events = JSON.parse(savedEvents);
    } else {
         localStorage.setItem('eventData', JSON.stringify(localDB.events));
    }

    localStorage.removeItem('activeQrTokens');
    setTimeout(() => showView('login-view'), 500);
}

initializeApp();







