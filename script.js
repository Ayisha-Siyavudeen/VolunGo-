function showMessage() {
    alert("Welcome to VolunGo!");
}

 function register() {
    alert("Volunteer Registered Successfully!");
    localStorage.setItem("registered", "true");
}

function postOpportunity() {
    const eventName = document.getElementById("eventName").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const skills = document.getElementById("skills").value;

    if (!eventName || !location || !date || !skills) {
        alert("Please fill in all fields");
        return;
    }

    const event = {
        id: Date.now(),
        name: eventName,
        location: location,
        date: date,
        skills: skills,
        category: "Professional"
    };

    // Get existing events from localStorage
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    alert("Event Posted Successfully!");
    
    // Clear form
    document.getElementById("eventForm").reset();
    
    // Refresh event list
    displayPostedEvents();
}

function displayPostedEvents() {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const eventList = document.getElementById("eventList");
    
    if (!eventList) return;
    
    eventList.innerHTML = "";
    
    if (events.length === 0) {
        eventList.innerHTML = "<p>No events posted yet.</p>";
        return;
    }
    
    events.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.style.border = "1px solid #ddd";
        eventDiv.style.padding = "15px";
        eventDiv.style.margin = "10px 0";
        eventDiv.style.borderRadius = "5px";
        eventDiv.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Skills Required:</strong> ${event.skills}</p>
            <button onclick="deleteEvent(${event.id})">Delete</button>
        `;
        eventList.appendChild(eventDiv);
    });
}

function deleteEvent(eventId) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events = events.filter(event => event.id !== eventId);
    localStorage.setItem("events", JSON.stringify(events));
    displayPostedEvents();
}

function displayOpportunitiesFromStorage() {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const opportunitiesDiv = document.getElementById("opportunities");
    
    if (!opportunitiesDiv) return;
    
    opportunitiesDiv.innerHTML = "";
    
    if (events.length > 0) {
        events.forEach(event => {
            const eventDiv = document.createElement("div");
            eventDiv.style.background = "white";
            eventDiv.style.padding = "15px";
            eventDiv.style.margin = "15px auto";
            eventDiv.style.width = "90%";
            eventDiv.style.maxWidth = "900px";
            eventDiv.style.borderRadius = "10px";
            eventDiv.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.1)";
            eventDiv.innerHTML = `
                <h3>${event.name}</h3>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Skills Required:</strong> ${event.skills}</p>
                <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                    <strong>📝 To apply for this event, please </strong><a href="profile.html" style="color: #00796b; font-weight: bold; text-decoration: underline;">login to your profile</a>
                </p>
            `;
            opportunitiesDiv.appendChild(eventDiv);
        });
    }
}

function apply(eventId) {
    if (!eventId) {
        console.error("No event ID provided");
        return;
    }
    
    // Find the event details from localStorage
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const selectedEvent = events.find(event => event.id === eventId);
    
    if (selectedEvent) {
        // Clear any previous selection and store ONLY this specific event
        localStorage.removeItem("selectedEventForApplication");
        localStorage.setItem("selectedEventForApplication", JSON.stringify(selectedEvent));
        
        console.log("Applying for event:", selectedEvent.name);
        
        // Redirect to volunteer registration
        window.location.href = "volunteer.html";
    } else {
        console.error("Event not found:", eventId);
        alert("Error: Event not found");
    }
}



function acceptVolunteer(button) {
    const row = button.parentNode.parentNode;
    alert("Volunteer accepted!");
    row.style.backgroundColor = "#d4edda";
}

function rejectVolunteer(button) {
    const row = button.parentNode.parentNode;
    alert("Volunteer rejected!");
    row.style.backgroundColor = "#f8d7da";
}

function registerVolunteer() {
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const age = document.getElementById("age").value;
    const location = document.getElementById("location").value;
    const skills = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;
    const interests = document.getElementById("interests").value;
    const availability = document.getElementById("availability").value;
    const hoursPerWeek = document.getElementById("hoursPerWeek").value;
    const motivation = document.getElementById("motivation").value;
    const terms = document.getElementById("terms").checked;

    if (!fullName || !email || !phone || !age || !location || !skills || !experience || !interests || !availability || !hoursPerWeek || !motivation || !terms) {
        alert("Please fill in all fields and agree to terms and conditions");
        return;
    }

    const volunteer = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        phone: phone,
        age: age,
        location: location,
        skills: skills,
        experience: experience,
        interests: interests,
        availability: availability,
        hoursPerWeek: hoursPerWeek,
        motivation: motivation,
        registrationDate: new Date().toLocaleDateString(),
        appliedEvent: null,
        appliedEventId: null
    };
    
    // Get the selected event if user clicked Apply on a specific event
    const selectedEvent = JSON.parse(localStorage.getItem("selectedEventForApplication"));
    if (selectedEvent) {
        volunteer.appliedEvent = selectedEvent.name;
        volunteer.appliedEventId = selectedEvent.id;
    }

    // Get existing volunteers from localStorage
    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
    volunteers.push(volunteer);
    localStorage.setItem("volunteers", JSON.stringify(volunteers));

    // Store current volunteer
    localStorage.setItem("currentVolunteer", JSON.stringify(volunteer));
    
    // Create notification for organization if applying for an event
    if (selectedEvent) {
        let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        const notification = {
            id: Date.now(),
            organizationId: selectedEvent.organizationId,
            organizationName: selectedEvent.organizationName,
            volunteerId: volunteer.id,
            volunteerName: fullName,
            eventId: selectedEvent.id,
            eventName: selectedEvent.name,
            status: "pending",
            message: `New application from ${fullName} for the event "${selectedEvent.name}"`,
            appliedDate: new Date().toLocaleDateString(),
            decidedDate: null,
            volunteerEmail: email,
            volunteerPhone: phone
        };
        notifications.push(notification);
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }
    
    // Clear the selected event from localStorage after registration
    localStorage.removeItem("selectedEventForApplication");

    // Hide form and show success message
    document.getElementById("volunteerForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";
    
    // Show event confirmation if they applied for a specific event
    if (volunteer.appliedEvent && volunteer.appliedEventId) {
        const appliedEventConfirmation = document.getElementById("appliedEventConfirmation");
        if (appliedEventConfirmation) {
            appliedEventConfirmation.style.display = "block";
            document.getElementById("appliedEventName").textContent = volunteer.appliedEvent;
        }
        console.log("Registered for event:", volunteer.appliedEvent);
    }

    // Scroll to success message
    document.getElementById("successMessage").scrollIntoView({ behavior: "smooth" });
}


function initializePage() {
    if (document.getElementById("opportunities")) {
        displayOpportunitiesFromStorage();
    }
    if (document.getElementById("eventList")) {
        displayPostedEvents();
    }
    if (document.getElementById("volunteerForm")) {
        checkVolunteerStatus();
    }
    
    // Check if on profile page and user is logged in
    if (document.getElementById("profileDashboard")) {
        const loggedInVolunteer = localStorage.getItem("loggedInVolunteer");
        if (loggedInVolunteer) {
            displayProfileDashboard();
        }
    }
    
    // Check if on organization profile page
    if (document.getElementById("orgDashboard")) {
        checkOrgStatus();
    }
}

function checkVolunteerStatus() {
    const currentVolunteer = localStorage.getItem("currentVolunteer");
    const selectedEvent = JSON.parse(localStorage.getItem("selectedEventForApplication"));
    
    // Display the event they're applying for if available
    if (selectedEvent && document.getElementById("appliedEventInfo")) {
        document.getElementById("appliedEventInfo").style.display = "block";
        document.getElementById("eventName").textContent = selectedEvent.name;
    }
    
    if (currentVolunteer) {
        // If volunteer is already registered, show success message
        document.getElementById("volunteerForm").style.display = "none";
        document.getElementById("successMessage").style.display = "block";
        const volunteer = JSON.parse(currentVolunteer);
        let successHTML = `
            <h3>Welcome Back, ${volunteer.fullName}!</h3>
            <p>Your profile is registered and active on VolunGo.</p>
            <p><strong>Email:</strong> ${volunteer.email}</p>
        `;
        
        if (volunteer.appliedEvent) {
            successHTML += `<p style="margin-top: 10px; color: #155724;"><strong>✓ Applied for:</strong> ${volunteer.appliedEvent}</p>`;
        }
        
        successHTML += `
            <p style="margin-top: 15px; font-size: 14px; color: #666;">You can now browse and apply for more volunteer opportunities</p>
            <a href="index1.html" style="background-color: #00796b; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin-top: 10px;">View Opportunities</a>
        `;
        
        document.getElementById("successMessage").innerHTML = successHTML;
    }
}

/* ===== VOLUNTEER PROFILE MANAGEMENT ===== */

function createProfile() {
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;
    const fullName = document.getElementById("regFullName").value.trim();
    const email = document.getElementById("regEmail").value.trim();

    if (!username || !password || !fullName || !email) {
        alert("Please fill in all fields");
        return;
    }

    // Check if username already exists
    let profiles = JSON.parse(localStorage.getItem("volunteerProfiles")) || [];
    if (profiles.find(profile => profile.username === username)) {
        alert("Username already exists. Please choose another.");
        return;
    }

    const newProfile = {
        id: Date.now(),
        username: username,
        password: password, // In production, use hashing
        fullName: fullName,
        email: email,
        createdDate: new Date().toLocaleDateString(),
        applications: []
    };

    profiles.push(newProfile);
    localStorage.setItem("volunteerProfiles", JSON.stringify(profiles));

    alert("Profile created successfully! Please login with your credentials.");
    
    // Clear form
    document.getElementById("regUsername").value = "";
    document.getElementById("regPassword").value = "";
    document.getElementById("regFullName").value = "";
    document.getElementById("regEmail").value = "";
}

function loginVolunteer() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    const profiles = JSON.parse(localStorage.getItem("volunteerProfiles")) || [];
    const profile = profiles.find(p => p.username === username && p.password === password);

    if (!profile) {
        alert("Invalid username or password");
        return;
    }

    // Store logged-in user
    localStorage.setItem("loggedInVolunteer", JSON.stringify(profile));
    console.log("Logged in as:", profile.fullName);
    
    displayProfileDashboard();
}

function logoutVolunteer() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("loggedInVolunteer");
        location.reload();
    }
}

function displayProfileDashboard() {
    const loggedInVolunteer = JSON.parse(localStorage.getItem("loggedInVolunteer"));
    
    if (!loggedInVolunteer) return;

    // Hide login section, show dashboard
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("profileDashboard").style.display = "block";

    // Fill in profile info
    document.getElementById("profileName").textContent = loggedInVolunteer.fullName;
    document.getElementById("profileEmail").textContent = loggedInVolunteer.email;
    document.getElementById("memberSince").textContent = loggedInVolunteer.createdDate;

    // Display notifications
    displayVolunteerNotifications();
    
    // Display available events
    displayAvailableEventsForProfile();
    
    // Display applied events
    displayAppliedEventsForProfile();
}

function displayAvailableEventsForProfile() {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const loggedInVolunteer = JSON.parse(localStorage.getItem("loggedInVolunteer"));
    const availableEventsDiv = document.getElementById("availableEvents");

    availableEventsDiv.innerHTML = "";

    if (events.length === 0) {
        availableEventsDiv.innerHTML = "<p style='text-align: center; color: #666;'>No events available at the moment.</p>";
        return;
    }

    events.forEach(event => {
        // Check if volunteer already applied
        const hasApplied = loggedInVolunteer.applications && loggedInVolunteer.applications.find(app => app.eventId === event.id);
        
        const eventDiv = document.createElement("div");
        eventDiv.style.background = "white";
        eventDiv.style.padding = "20px";
        eventDiv.style.borderRadius = "10px";
        eventDiv.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.1)";
        
        let buttonHTML = `<button onclick="applyToEventFromProfile(${event.id})">Apply</button>`;
        if (hasApplied) {
            buttonHTML = `<button style="background-color: #6c757d; cursor: not-allowed;" disabled>Already Applied</button>`;
        }

        eventDiv.innerHTML = `
            <h3 style="margin-top: 0; color: #00796b;">${event.name}</h3>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Skills Required:</strong> ${event.skills}</p>
            ${buttonHTML}
        `;
        availableEventsDiv.appendChild(eventDiv);
    });
}

function displayAppliedEventsForProfile() {
    const loggedInVolunteer = JSON.parse(localStorage.getItem("loggedInVolunteer"));
    const appliedEventsDiv = document.getElementById("appliedEvents");

    appliedEventsDiv.innerHTML = "";

    if (!loggedInVolunteer.applications || loggedInVolunteer.applications.length === 0) {
        appliedEventsDiv.innerHTML = "<p style='text-align: center; color: #666;'>You haven't applied for any events yet.</p>";
        document.getElementById("appliedCount").textContent = "0";
        return;
    }

    document.getElementById("appliedCount").textContent = loggedInVolunteer.applications.length;

    loggedInVolunteer.applications.forEach(application => {
        const appDiv = document.createElement("div");
        appDiv.style.background = "#e8f5e9";
        appDiv.style.padding = "20px";
        appDiv.style.marginBottom = "15px";
        appDiv.style.borderRadius = "10px";
        appDiv.style.borderLeft = "4px solid #4caf50";
        
        appDiv.innerHTML = `
            <h4 style="margin-top: 0; color: #2e7d32;">${application.eventName}</h4>
            <p style="margin: 8px 0;"><strong>Location:</strong> ${application.location}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${application.date}</p>
            <p style="margin: 8px 0; color: #666; font-size: 13px;"><strong>Applied on:</strong> ${application.appliedDate}</p>
            <button onclick="cancelApplicationFromProfile(${application.eventId})" style="background-color: #f44336; margin-top: 10px;">Cancel Application</button>
        `;
        appliedEventsDiv.appendChild(appDiv);
    });
}

function applyToEventFromProfile(eventId) {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        alert("Event not found");
        return;
    }

    let loggedInVolunteer = JSON.parse(localStorage.getItem("loggedInVolunteer"));
    
    // Check if already applied
    if (loggedInVolunteer.applications && loggedInVolunteer.applications.find(app => app.eventId === eventId)) {
        alert("You have already applied for this event");
        return;
    }

    // Add application
    if (!loggedInVolunteer.applications) {
        loggedInVolunteer.applications = [];
    }

    const application = {
        eventId: event.id,
        eventName: event.name,
        location: event.location,
        date: event.date,
        appliedDate: new Date().toLocaleDateString()
    };

    loggedInVolunteer.applications.push(application);

    // Update localStorage
    localStorage.setItem("loggedInVolunteer", JSON.stringify(loggedInVolunteer));
    
    // Update volunteer profiles
    let profiles = JSON.parse(localStorage.getItem("volunteerProfiles")) || [];
    const profileIndex = profiles.findIndex(p => p.id === loggedInVolunteer.id);
    if (profileIndex !== -1) {
        profiles[profileIndex] = loggedInVolunteer;
        localStorage.setItem("volunteerProfiles", JSON.stringify(profiles));
    }

    // Create notification for organization
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const notification = {
        id: Date.now(),
        organizationId: event.organizationId,
        organizationName: event.organizationName,
        volunteerId: loggedInVolunteer.id,
        volunteerName: loggedInVolunteer.fullName,
        eventId: event.id,
        eventName: event.name,
        status: "pending",
        message: `New application from ${loggedInVolunteer.fullName} for the event "${event.name}"`,
        appliedDate: new Date().toLocaleDateString(),
        decidedDate: null
    };
    notifications.push(notification);
    localStorage.setItem("notifications", JSON.stringify(notifications));

    alert("Applied successfully! The organization will review your application soon.");
    displayAvailableEventsForProfile();
    displayAppliedEventsForProfile();
}

function cancelApplicationFromProfile(eventId) {
    if (!confirm("Are you sure you want to cancel this application?")) {
        return;
    }

    let loggedInVolunteer = JSON.parse(localStorage.getItem("loggedInVolunteer"));
    
    loggedInVolunteer.applications = loggedInVolunteer.applications.filter(app => app.eventId !== eventId);

    // Update localStorage
    localStorage.setItem("loggedInVolunteer", JSON.stringify(loggedInVolunteer));
    
    // Update volunteer profiles
    let profiles = JSON.parse(localStorage.getItem("volunteerProfiles")) || [];
    const profileIndex = profiles.findIndex(p => p.id === loggedInVolunteer.id);
    if (profileIndex !== -1) {
        profiles[profileIndex] = loggedInVolunteer;
        localStorage.setItem("volunteerProfiles", JSON.stringify(profiles));
    }

    alert("Application cancelled.");
    displayAvailableEventsForProfile();
    displayAppliedEventsForProfile();
}

function displayVolunteerNotifications() {
    const loggedInVolunteer = JSON.parse(localStorage.getItem("loggedInVolunteer"));
    if (!loggedInVolunteer) return;
    
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    let volunteerNotifications = notifications.filter(n => n.volunteerId === loggedInVolunteer.id);
    
    let notifDiv = document.getElementById("notifications");
    if (!notifDiv) return;
    
    if (volunteerNotifications.length === 0) {
        notifDiv.innerHTML = "<p style='text-align: center; color: #999;'>No notifications yet</p>";
        return;
    }
    
    notifDiv.innerHTML = "";
    
    // Sort by date (most recent first)
    volunteerNotifications.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    
    volunteerNotifications.forEach(notif => {
        const notifCard = document.createElement("div");
        let bgColor, borderColor, statusIcon;
        
        if (notif.status === "pending") {
            bgColor = "#fff9e6";
            borderColor = "#ff9800";
            statusIcon = "⏳";
        } else if (notif.status === "accepted") {
            bgColor = "#e8f5e9";
            borderColor = "#28a745";
            statusIcon = "✓";
        } else {
            bgColor = "#ffebee";
            borderColor = "#dc3545";
            statusIcon = "✗";
        }
        
        notifCard.style.cssText = `background: ${bgColor}; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid ${borderColor}; box-shadow: 0px 2px 8px rgba(0,0,0,0.1);`;
        
        let decidedDateText = "";
        if (notif.decidedDate) {
            decidedDateText = `<p style="margin: 5px 0; font-size: 12px; color: #666;">Decided on: ${notif.decidedDate}</p>`;
        }
        
        notifCard.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: ${borderColor};">${statusIcon} ${notif.message}</h4>
            <p style="margin: 5px 0;"><strong>Organization:</strong> ${notif.organizationName}</p>
            <p style="margin: 5px 0;"><strong>Event:</strong> ${notif.eventName}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">Applied on: ${notif.appliedDate}</p>
            ${decidedDateText}
        `;
        notifDiv.appendChild(notifCard);
    });
}

// ============ ORGANIZATION PROFILE FUNCTIONS ============

function loginOrganization() {
    const username = document.getElementById("orgLoginUsername").value;
    const password = document.getElementById("orgLoginPassword").value;

    if (!username || !password) {
        alert("Please fill in both fields");
        return;
    }

    let organizations = JSON.parse(localStorage.getItem("organizationProfiles")) || [];
    const org = organizations.find(o => o.username === username && o.password === password);

    if (!org) {
        alert("Invalid username or password");
        return;
    }

    localStorage.setItem("loggedInOrganization", JSON.stringify(org));
    alert("Logged in successfully!");
    displayOrgDashboard();
}

function createOrganizationProfile() {
    const username = document.getElementById("orgRegUsername").value;
    const password = document.getElementById("orgRegPassword").value;
    const name = document.getElementById("orgRegName").value;
    const email = document.getElementById("orgRegEmail").value;

    if (!username || !password || !name || !email) {
        alert("Please fill in all fields");
        return;
    }

    let organizations = JSON.parse(localStorage.getItem("organizationProfiles")) || [];
    
    if (organizations.find(o => o.username === username)) {
        alert("Username already exists");
        return;
    }

    const newOrg = {
        id: Date.now(),
        username: username,
        password: password,
        name: name,
        email: email,
        createdDate: new Date().toLocaleDateString(),
        postedEvents: [],
        applications: []
    };

    organizations.push(newOrg);
    localStorage.setItem("organizationProfiles", JSON.stringify(organizations));
    
    localStorage.setItem("loggedInOrganization", JSON.stringify(newOrg));
    alert("Profile created successfully! Welcome to VolunGo!");
    document.getElementById("orgRegUsername").value = "";
    document.getElementById("orgRegPassword").value = "";
    document.getElementById("orgRegName").value = "";
    document.getElementById("orgRegEmail").value = "";
    displayOrgDashboard();
}

function displayOrgDashboard() {
    let loggedInOrg = JSON.parse(localStorage.getItem("loggedInOrganization"));
    
    if (!loggedInOrg) {
        document.getElementById("orgLoginSection").style.display = "block";
        document.getElementById("orgDashboard").style.display = "none";
        return;
    }

    document.getElementById("orgLoginSection").style.display = "none";
    document.getElementById("orgDashboard").style.display = "block";
    
    document.getElementById("orgName").textContent = loggedInOrg.name;
    document.getElementById("orgEmail").textContent = loggedInOrg.email;
    
    // Get all events posted by this organization
    let allEvents = JSON.parse(localStorage.getItem("events")) || [];
    let orgEvents = allEvents.filter(e => e.organizationId === loggedInOrg.id);
    
    document.getElementById("eventsCount").textContent = orgEvents.length;
    
    // Count all applications for this org's events
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    let orgApplications = notifications.filter(n => n.organizationId === loggedInOrg.id && n.status === "pending");
    document.getElementById("applicationsCount").textContent = orgApplications.length;
    
    displayOrgPostedEvents();
    displayOrgApplications();
}

function orgPostEvent() {
    let loggedInOrg = JSON.parse(localStorage.getItem("loggedInOrganization"));
    
    if (!loggedInOrg) {
        alert("Please login to your organization profile first");
        return;
    }

    const eventName = document.getElementById("orgEventName").value;
    const location = document.getElementById("orgEventLocation").value;
    const date = document.getElementById("orgEventDate").value;
    const skills = document.getElementById("orgEventSkills").value;

    if (!eventName || !location || !date || !skills) {
        alert("Please fill in all fields");
        return;
    }

    const event = {
        id: Date.now(),
        name: eventName,
        location: location,
        date: date,
        skills: skills,
        category: "Professional",
        organizationId: loggedInOrg.id,
        organizationName: loggedInOrg.name,
        postedDate: new Date().toLocaleDateString()
    };

    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    alert("Event posted successfully!");
    document.getElementById("orgEventForm").reset();
    displayOrgPostedEvents();
    displayOpportunitiesFromStorage();
}

function displayOrgPostedEvents() {
    let loggedInOrg = JSON.parse(localStorage.getItem("loggedInOrganization"));
    if (!loggedInOrg) return;
    
    let allEvents = JSON.parse(localStorage.getItem("events")) || [];
    let orgEvents = allEvents.filter(e => e.organizationId === loggedInOrg.id);
    
    let eventsDiv = document.getElementById("orgPostedEvents");
    if (!eventsDiv) return;
    
    if (orgEvents.length === 0) {
        eventsDiv.innerHTML = "<p style='text-align: center; color: #999;'>No events posted yet</p>";
        return;
    }
    
    eventsDiv.innerHTML = "";
    orgEvents.forEach(event => {
        let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        let eventApplications = notifications.filter(n => n.eventId === event.id);
        
        const eventDiv = document.createElement("div");
        eventDiv.style.cssText = "background: white; padding: 20px; margin: 15px 0; border-radius: 12px; border-left: 5px solid #00796b; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);";
        eventDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #00796b;">${event.name}</h3>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${event.location}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${event.date}</p>
            <p style="margin: 5px 0;"><strong>Skills Required:</strong> ${event.skills}</p>
            <p style="margin: 5px 0; color: #00796b; font-weight: bold;">Applications: ${eventApplications.length}</p>
        `;
        eventsDiv.appendChild(eventDiv);
    });
}

function displayOrgApplications() {
    let loggedInOrg = JSON.parse(localStorage.getItem("loggedInOrganization"));
    if (!loggedInOrg) return;
    
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    let orgApplications = notifications.filter(n => n.organizationId === loggedInOrg.id);
    
    let appDiv = document.getElementById("orgApplications");
    if (!appDiv) return;
    
    if (orgApplications.length === 0) {
        appDiv.innerHTML = "<p style='text-align: center; color: #999;'>No applications yet</p>";
        return;
    }
    
    appDiv.innerHTML = "";
    
    // Group applications by status
    const pendingApps = orgApplications.filter(a => a.status === "pending");
    const acceptedApps = orgApplications.filter(a => a.status === "accepted");
    const rejectedApps = orgApplications.filter(a => a.status === "rejected");
    
    // Display pending applications
    if (pendingApps.length > 0) {
        const pendingDiv = document.createElement("div");
        pendingDiv.innerHTML = "<h3 style='color: #ff9800; margin: 20px 0 15px 0;'>⏳ Pending Applications</h3>";
        pendingDiv.style.marginBottom = "20px";
        
        pendingApps.forEach(app => {
            const appCard = document.createElement("div");
            appCard.style.cssText = "background: white; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid #ff9800; box-shadow: 0px 2px 8px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;";
            appCard.innerHTML = `
                <div>
                    <p style="margin: 5px 0;"><strong>Volunteer:</strong> ${app.volunteerName}</p>
                    <p style="margin: 5px 0;"><strong>Event:</strong> ${app.eventName}</p>
                    <p style="margin: 5px 0; font-size: 12px; color: #666;">Applied: ${app.appliedDate}</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="acceptApplication(${app.id})" style="background-color: #28a745; padding: 8px 16px; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Accept</button>
                    <button onclick="rejectApplication(${app.id})" style="background-color: #dc3545; padding: 8px 16px; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Reject</button>
                </div>
            `;
            pendingDiv.appendChild(appCard);
        });
        appDiv.appendChild(pendingDiv);
    }
    
    // Display accepted applications
    if (acceptedApps.length > 0) {
        const acceptedDiv = document.createElement("div");
        acceptedDiv.innerHTML = "<h3 style='color: #28a745; margin: 20px 0 15px 0;'>✓ Accepted</h3>";
        acceptedDiv.style.marginBottom = "20px";
        
        acceptedApps.forEach(app => {
            const appCard = document.createElement("div");
            appCard.style.cssText = "background: white; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid #28a745; box-shadow: 0px 2px 8px rgba(0,0,0,0.1);";
            appCard.innerHTML = `
                <p style="margin: 5px 0;"><strong>Volunteer:</strong> ${app.volunteerName}</p>
                <p style="margin: 5px 0;"><strong>Event:</strong> ${app.eventName}</p>
                <p style="margin: 5px 0; font-size: 12px; color: #666;">Status: <span style="color: #28a745; font-weight: bold;">Accepted on ${app.decidedDate}</span></p>
            `;
            acceptedDiv.appendChild(appCard);
        });
        appDiv.appendChild(acceptedDiv);
    }
    
    // Display rejected applications
    if (rejectedApps.length > 0) {
        const rejectedDiv = document.createElement("div");
        rejectedDiv.innerHTML = "<h3 style='color: #dc3545; margin: 20px 0 15px 0;'>✗ Rejected</h3>";
        rejectedDiv.style.marginBottom = "20px";
        
        rejectedApps.forEach(app => {
            const appCard = document.createElement("div");
            appCard.style.cssText = "background: white; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid #dc3545; box-shadow: 0px 2px 8px rgba(0,0,0,0.1);";
            appCard.innerHTML = `
                <p style="margin: 5px 0;"><strong>Volunteer:</strong> ${app.volunteerName}</p>
                <p style="margin: 5px 0;"><strong>Event:</strong> ${app.eventName}</p>
                <p style="margin: 5px 0; font-size: 12px; color: #666;">Status: <span style="color: #dc3545; font-weight: bold;">Rejected on ${app.decidedDate}</span></p>
            `;
            rejectedDiv.appendChild(appCard);
        });
        appDiv.appendChild(rejectedDiv);
    }
}

function acceptApplication(notificationId) {
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const appIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (appIndex === -1) {
        alert("Application not found");
        return;
    }
    
    notifications[appIndex].status = "accepted";
    notifications[appIndex].decidedDate = new Date().toLocaleDateString();
    notifications[appIndex].message = `Your application for "${notifications[appIndex].eventName}" has been ACCEPTED!`;
    
    localStorage.setItem("notifications", JSON.stringify(notifications));
    displayOrgApplications();
    alert("Application accepted! Volunteer has been notified.");
}

function rejectApplication(notificationId) {
    if (!confirm("Are you sure you want to reject this application?")) {
        return;
    }
    
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const appIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (appIndex === -1) {
        alert("Application not found");
        return;
    }
    
    notifications[appIndex].status = "rejected";
    notifications[appIndex].decidedDate = new Date().toLocaleDateString();
    notifications[appIndex].message = `Your application for "${notifications[appIndex].eventName}" has been REJECTED.`;
    
    localStorage.setItem("notifications", JSON.stringify(notifications));
    displayOrgApplications();
    alert("Application rejected! Volunteer has been notified.");
}

function logoutOrganization() {
    if (!confirm("Are you sure you want to logout?")) {
        return;
    }
    localStorage.removeItem("loggedInOrganization");
    location.reload();
}

function checkOrgStatus() {
    let loggedInOrg = JSON.parse(localStorage.getItem("loggedInOrganization"));
    if (loggedInOrg) {
        if (document.getElementById("orgDashboard")) {
            displayOrgDashboard();
        }
    } else {
        if (document.getElementById("orgLoginSection")) {
            document.getElementById("orgLoginSection").style.display = "block";
            document.getElementById("orgDashboard").style.display = "none";
        }
    }
}

// Run initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);


