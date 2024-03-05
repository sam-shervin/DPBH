import { useEffect, useState } from "react";
import "./App.css";


function App() {
    const [capturedClasses, setCapturedClasses] = useState<string[]>([]);
    const [apiData, setApiData] = useState<string>();

    const handleClick = async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });

        chrome.scripting.executeScript({
            target: { tabId: tab.id as number },
            func: () => {
                const allClasses = [];
                const allElements = document.querySelectorAll("*");

                for (const element of allElements) {
                    const classes = element.className.toString().split(/\s+/);
                    for (const cls of classes) {
                        if (cls && allClasses.indexOf(cls) === -1)
                            allClasses.push(cls);
                    }
                }

                chrome.runtime.sendMessage({
                    action: "capturedClasses",
                    classes: allClasses,
                });
            },
        });
    };

    useEffect(() => {
        chrome.runtime.onMessage.addListener((message) => {
            if (message.action === "capturedClasses") {
                setCapturedClasses(message.classes);
            }
        });
    });
    const fetchData = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        setApiData(data);
    };

    useEffect(() => {
        fetchData();

        chrome.runtime.onMessage.addListener((message) => {
            if (message.action === "capturedClasses") {
                setCapturedClasses(message.classes);
            }
        });
    }, [fetchData]);
    return (
        <>
            <div>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img src="/icon.png" alt="React Logo" />
                </a>
            </div>
            <h1>My Extension</h1>
            <div className="card">
                {apiData && (
                    <div>
                        <h2>{apiData.title}</h2>
                        <p>{apiData.body}</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
