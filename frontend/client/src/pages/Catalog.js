import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Catalog = () => {
    const [subjects, setSubjects] = useState(null);
    const [courses, setCourses] = useState(null);
    const [decks, setDecks] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectsResponse = await fetch('//localhost:5000/api/catalog');
                const coursesResponse = await fetch('//localhost:5000/api/courses');
                const decksResponse = await fetch('//localhost:5000/api/decks');

                if (!subjectsResponse.ok || !coursesResponse.ok || !decksResponse.ok) {
                    throw new Error('One or more requests failed.');
                }

                const subjectsData = await subjectsResponse.json();
                const coursesData = await coursesResponse.json();
                const decksData = await decksResponse.json();

                setSubjects(subjectsData);
                setCourses(coursesData);
                setDecks(decksData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    function viewDecks(courseID) {
        const deckList = document.getElementById("deckList");
        if (decks !== null) {
            if (courseID === "all") {
                document.getElementById("deckList").innerHTML = "";
                if (decks !== null) {
                    // View all Decks since no Course is selected
                    for (let i = 0; i < decks.length; i++) {
                        const deck = decks[i];
                        // Creating Elements
                        const button = document.createElement("button");
                        const btnName = document.createElement("h3");
                        // Setting Hierachy
                        deckList.appendChild(button);
                        button.appendChild(btnName);
                        btnName.appendChild(document.createTextNode(deck.deck_name));
                        // Setting Button Attributes
                        button.className = "deckButton";
                        button.setAttribute('data-key', deck._id);
                        button.onclick = () => navigate('/Deck/' + deck._id);
                    }
                }
            }
            else {
                document.getElementById("deckList").innerHTML = "";
                for (let i = 0; i < decks.length; i++) {
                    const deck = decks[i];
                    if (deck.course_id === courseID) {
                        // Creating Elements
                        const button = document.createElement("button");
                        const btnName = document.createElement("h3");
                        // Setting Hierachy
                        deckList.appendChild(button);
                        button.appendChild(btnName);
                        btnName.appendChild(document.createTextNode(deck.deck_name));
                        // Setting Button Attributes
                        button.className = "deckButton";
                        button.setAttribute('data-key', deck._id);
                        button.onclick = () => navigate('/Deck/' + deck._id);
                    }
                }
            }
            // 'Create new Deck'-button
            // Creating Elements
            const button = document.createElement("button");
            const btnName = document.createElement("h3");
            // Setting Hierachy
            deckList.appendChild(button);
            button.appendChild(btnName);
            btnName.appendChild(document.createTextNode("Create New"));
            // Setting Attributes
            button.className = "deckButton createBtn";
            button.onclick = () => navigate("/Create");
            for (let i = 0; i < courses.length; i++) {
                const course = courses[i];
                if (course._id === courseID) {
                    document.getElementById(course._id).className = "filterButton selected";
                }
                else {
                    if (document.getElementById(course._id)) {
                        document.getElementById(course._id).className = "filterButton";
                    }
                }
            }
        }
    }
    function viewCourses(subjectID) {
        const courseList = document.getElementById("courseList");
        courseList.innerHTML = "";
        if (subjectID === "all") {
            if (courses !== null) {
                // View all Course since no Subject is selected
                for (let i = 0; i < courses.length; i++) {
                    const course = courses[i];
                    // Creating Elements
                    const button = document.createElement("button");
                    const btnName = document.createElement("h3");
                    // Setting Hierachy
                    courseList.appendChild(button);
                    button.appendChild(btnName);
                    btnName.appendChild(document.createTextNode(course.course_name));
                    // Setting Button Attributes
                    button.className = "filterButton";
                    button.setAttribute('data-key', course._id);
                    button.setAttribute('id', course._id);
                    button.onclick = () => viewDecks(course._id);
                }
                // View all decks since no courses are selected
                viewDecks("all");
            }
            document.getElementById("allSubjects").className = "filterButton selected";
            for (let i = 0; i < subjects.length; i++) {
                const subject = subjects[i];
                document.getElementById(subject._id).className = "filterButton";
            }
        }
        else {
            if (courses !== null) {
                for (let i = 0; i < courses.length; i++) {
                    const course = courses[i];
                    if (course.subject_id === subjectID) {
                        const course = courses[i];
                        // Creating Elements
                        const button = document.createElement("button");
                        const btnName = document.createElement("h3");
                        // Setting Hierachy
                        courseList.appendChild(button);
                        button.appendChild(btnName);
                        btnName.appendChild(document.createTextNode(course.course_name));
                        // Setting Button Attributes
                        button.className = "filterButton";
                        button.setAttribute('data-key', course._id);
                        button.setAttribute('id', course._id);
                        button.onclick = () => viewDecks(course._id);
                    }
                }
            }
            document.getElementById("allSubjects").className = "filterButton"
            for (let i = 0; i < subjects.length; i++) {
                const subject = subjects[i];
                if (subject._id === subjectID) {
                    document.getElementById(subject._id).className = "filterButton selected";
                }
                else {
                    document.getElementById(subject._id).className = "filterButton";
                }
            }
        }
        // 'Create new Course'-button
        // Creating Elements
        const button = document.createElement("button");
        const btnName = document.createElement("h3");
        // Setting Hierachy
        courseList.appendChild(button);
        button.appendChild(btnName);
        btnName.appendChild(document.createTextNode("Create New"));
        // Setting Attributes
        button.className = "filterButton createBtn";
        button.onClick = () => navigate("/Create");
    }
    return (
        <div className="catalog">
            <div className="filterNav">
                <button className="filterListButton" title="Click to hide List"><h2>Subjects</h2></button>
                <div className="filterList" id="subjectList">
                    <button className="filterButton selected" onClick={() => viewCourses("all")} id="allSubjects">
                        <h3>All</h3>
                    </button>
                    {subjects && subjects.map((subject) => (
                        <button key={subject._id} className="filterButton" onClick={() => viewCourses(subject._id)} id={subject._id}>
                            <h3>{subject.subject_name}</h3>
                        </button>
                    ))}
                </div>
                <button className="filterListButton" title="Click to hide List"><h2>Courses</h2></button>
                <div className="filterList" id="courseList">
                    {courses && courses.map((course) => (
                        <button key={course._id} className="filterButton" onClick={() => viewDecks(course._id)} id={course._id}>
                            <h3>{course.course_name}</h3>
                        </button>
                    ))}
                    <button className="filterButton createBtn" onClick={() => navigate("/Create")}>
                        <h3>Create New</h3>
                    </button>
                </div>
            </div>
            <div className="deckCatalog">
            <h2>Decks</h2>
                <div className="deckList" id="deckList">
                    {decks && decks.map((deck) => (
                        <button key={deck._id} className="deckButton" onClick={() => navigate('/Deck/' + deck._id)}>
                            <h3>{deck.deck_name}</h3>
                        </button>
                    ))}
                    <button className="deckButton createBtn" onClick={() => navigate("/Create")}>
                        <h3>Create New</h3>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Catalog;