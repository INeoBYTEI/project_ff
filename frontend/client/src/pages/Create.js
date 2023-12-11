import { useState, useEffect } from "react";

const Create = () => {
    // Data to send to the server
    const [itemData, setItemData] = useState(null);
    // Fetching Data
    const [subjects, setSubjects] = useState(null);
    const [courses, setCourses] = useState(null);
    const [decks, setDecks] = useState(null);
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

    // Course Creation
    const [course_name, setCourseName] = useState('');
    const [subject_id, setSubject] = useState('');

    // Deck Creation
    const [deck_name, setDeckName] = useState('');
    const [course_id, setCourse] = useState('');

    // Card Creation
    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState('');
    const [deck_id, setDeck] = useState('');

    // Form Error
    const [error, setError] = useState(null);

    /* Sets the item type for which kind of item is being created
        Course - the user will be able to create a new course
        Deck - the user will be able to create a new deck
        Card - the user will be able to create a new card
        None - is the default value where the user will get to select an item type
    */
    const [itemType, setItemType] = useState('None');

    // handleSubmit is called when the user submits the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        switch (itemType) {
            case 'Course':
                console.log(course_name, subject_id);
                if (subject_id === '' || subject_id === 'all' || course_name === '') {
                    setError('Error: No Subject or Course Name entered!');
                    return;
                }
                setItemData({
                    course_name: course_name,
                    subject_id: subject_id
                });
                break;
            case 'Deck':
                if (course_id === '' || course_id === 'all' || deck_name=== '') {
                    setError('Error: No Course or Deck Name entered!');
                    return;
                }
                await setItemData({
                    deck_name: deck_name,
                    course_id: course_id
                });
                break;
            case 'Card':
                if (deck_id === '' || deck_id === 'none' || term === '' || definition === '') {
                    setError('Error: No Deck or Card Name/Definition entered!');
                    return;
                }
                await setItemData({
                    deck_ID: deck_id,
                    term: term,
                    definition: definition 
                });
                break;
            default:
                setError('Error: Invalid item type');
                return;
        }
        console.log(itemData);
        if (itemData !== null) {
            // Send the data to the server
            const response = await fetch(`//localhost:5000/api/${itemType.toLowerCase()}s`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });
        
            const json = await response.json();
            console.log(json);
    
    
            if (!response.ok) {
                setError(json.error);
                return;
            }
            else {
                setError(null);
                setName('');
                setSubject('');
                setCourse('');
                setDeck('');
                setDefinition('');
                console.log('New Course created', json);
                // Show pop-up message
                alert(`${itemType} created succesfully!`);
                // Reload page
                window.location.reload();
                return;
            }   
        }
        else {
            await buttonConfirm();
        }
        
    }

    // setName is called when the user types in the name field
    function setName(name) {
        switch (itemType) {
            case 'Course':
                // Course Creation
                setCourseName(name);
                break;
            case 'Deck':
                // Deck Creation
                setDeckName(name);
                break;
            case 'Card':
                // Card Creation
                setTerm(name);
                break;
            default:
                setError('Error: Invalid item type');
                break;
        }
    }

    function listDecks(courseID) {
        const deckList = document.getElementById("deckSelect");
        if (decks !== null) {
            if (courseID === "all") {
                if (decks !== null) {
                    deckList.innerHTML = "";
                    // Creating option for none selected
                    const noption = document.createElement("option");
                    // Setting Hierachy
                    deckList.appendChild(noption);
                    noption.appendChild(document.createTextNode("No Deck Selected"));
                    // Setting Button Attributes
                    noption.setAttribute('value', "all");
                    // View all Decks since no Course is selected
                    for (let i = 0; i < decks.length; i++) {
                        const deck = decks[i];
                        // Creating Elements
                        const option = document.createElement("option");
                        // Setting Hierachy
                        deckList.appendChild(option);
                        option.appendChild(document.createTextNode(deck.deck_name));
                        // Setting Button Attributes
                        option.setAttribute('value', deck._id);
                    }
                }
            }
            else {
                // Creating option for none selected
                const noption = document.createElement("option");
                // Setting Hierachy
                deckList.appendChild(noption);
                noption.appendChild(document.createTextNode("No Deck Selected"));
                // Setting Button Attributes
                noption.setAttribute('value', "all");
                deckList.innerHTML = "";
                for (let i = 0; i < decks.length; i++) {
                    const deck = decks[i];
                    if (deck.course_id === courseID) {
                        // Creating Elements
                        const option = document.createElement("option");
                        // Setting Hierachy
                        deckList.appendChild(option);
                        option.appendChild(document.createTextNode(deck.deck_name));
                        // Setting Button Attributes
                        option.setAttribute('value', deck._id);
                    }
                }
            }
        }
    }
    function listCourses(subjectID) {
        const courseList = document.getElementById("courseSelect");
        courseList.innerHTML = "";
        if (subjectID === "all") {
            if (courses !== null) {
                courseList.innerHTML = "";
                // Creating option for none selected
                const noption = document.createElement("option");
                // Setting Hierachy
                courseList.appendChild(noption);
                noption.appendChild(document.createTextNode("No Course Selected"));
                // Setting Button Attributes
                noption.setAttribute('value', "all");
                // View all Course since no Subject is selected
                for (let i = 0; i < courses.length; i++) {
                    const course = courses[i];
                    // Creating Elements
                    const option = document.createElement("option");
                    // Setting Hierachy
                    courseList.appendChild(option);
                    option.appendChild(document.createTextNode(course.course_name));
                    // Setting Button Attributes
                    option.setAttribute('value', course._id);
                }
                // View all decks since no courses are selected
                listDecks("all");
            }
        }
        else {
            if (courses !== null) {
                // Creating option for none selected
                const noption = document.createElement("option");
                // Setting Hierachy
                courseList.appendChild(noption);
                noption.appendChild(document.createTextNode("No Course Selected"));
                // Setting Button Attributes
                noption.setAttribute('value', "all");
                for (let i = 0; i < courses.length; i++) {
                    const course = courses[i];
                    if (course.subject_id === subjectID) {
                        const course = courses[i];
                        // Creating Elements
                        const option = document.createElement("option");
                        // Setting Hierachy
                        courseList.appendChild(option);
                        option.appendChild(document.createTextNode(course.course_name));
                        // Setting Button Attributes
                        option.setAttribute('value', course._id);
                    }
                }
            }
        }
    }

    function buttonConfirm() {
        const button = document.getElementById("submitFormButton");
        button.innerText = "Confirm";
    }

    return (
        <div className="create">
            <h2>{itemType === 'None' ? 'What would you like to create?' : `Create a new ${itemType}`}</h2>
            {itemType === 'None' && (
                // The Selection screen where the user can select which item type they want to create
                <>
                    <div className="createSelection">
                        <button onClick={() => setItemType('Course')}><h3>Course</h3></button>
                        <button onClick={() => setItemType('Deck')}><h3>Deck</h3></button>
                        <button onClick={() => setItemType('Card')}><h3>Card</h3></button>
                    </div>
                </>
            )}
            {itemType !== 'None' && (
                // The Creation screen where the user can create an item of the selected item type                
                <>
                    <form className="creationForm" onSubmit={handleSubmit}>
                        <label>{itemType === 'Card' ? 'Term' : `${itemType} Name`}</label>
                        {itemType === 'Course' && (
                            // The user is creating a Course
                            <>
                                <input type="text" onChange={(e) => setName(e.target.value)} value={course_name} placeholder={`Enter the name of the new ${itemType}*`}/>
                                
                                <label>Subject*</label>
                                <select id="subjectSelect" onChange={(e) => setSubject(e.target.value)}>
                                    <option value="all">
                                        No Subject Selected
                                    </option>
                                    {subjects && subjects.map((subject) => (
                                        <option key={subject._id} value={subject._id}>
                                            {subject.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </>)}
                        {itemType === 'Deck' && (
                            // The user is creating a Deck
                            <>
                                <input type="text" onChange={(e) => setName(e.target.value)} value={deck_name} placeholder={`Enter the name of the new ${itemType}*`}/>
                                
                                <label>Subject</label>
                                <select id="subjectSelect" onChange={(e) => listCourses(e.target.value)}>
                                    <option value="all">
                                        No Subject Selected
                                    </option>
                                    {subjects && subjects.map((subject) => (
                                        <option key={subject._id} value={subject._id}>
                                            {subject.subject_name}
                                        </option>
                                    ))}
                                </select>

                                <label>Course*</label>
                                <select id="courseSelect" onChange={(e) => setCourse(e.target.value)}>
                                    <option value="all">
                                        No Course Selected
                                    </option>
                                    {courses && courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                        {itemType === 'Card' && (
                            // The user is creating a Card
                            <>
                                <input type="text" onChange={(e) => setName(e.target.value)} value={term} placeholder='Enter the Term of the flashcard*'/>
                                <label>Definition</label>
                                <input type="text" onChange={(e) => setDefinition(e.target.value)} value={definition} placeholder="Enter the Definition of the flashcard*"/>

                                <label>Subject</label>
                                <select id="subjectSelect" onChange={(e) => listCourses(e.target.value)}>
                                    <option value="all">
                                        No Subject Selected
                                    </option>
                                    {subjects && subjects.map((subject) => (
                                        <option value={subject._id}>
                                            {subject.subject_name}
                                        </option>
                                    ))}
                                </select>

                                <label>Course</label>
                                <select id="courseSelect" onChange={(e) => listDecks(e.target.value)}>
                                    <option value="all">
                                        No Course Selected
                                    </option>
                                    {courses && courses.map((course) => (
                                        <option value={course._id}>
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>

                                <label>Deck</label>
                                <select id="deckSelect" onChange={(e) => setDeck(e.target.value)}>
                                    <option value="none">
                                        No Deck Selected*
                                    </option>
                                    {decks && decks.map((deck) => (
                                        <option value={deck._id}>
                                            {deck.deck_name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                        <div className="formButtons">
                            <button id="submitFormButton" type="submit">Add {itemType}</button>
                            <button type="button" onClick={() => {
                                const confirmMessage = "Are you sure you want to cancel?\n\n" +
                                    "If you haven't finished, you will lose your progress...";
                                if (window.confirm(confirmMessage)) {
                                    window.location.reload();
                                }
                            }}>Cancel</button>
                        </div>
                        {error && <div className="formError">{error}</div>}
                    </form>
                </>
            )}
        </div>
    );
};

export default Create;