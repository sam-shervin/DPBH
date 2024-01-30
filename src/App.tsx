// App.tsx
import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [capturedClasses, setCapturedClasses] = useState<string[]>([]);

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

    return (
        <>
            <div>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img src="/icon.png" alt="React Logo" />
                </a>
            </div>
            <h1>My Extension</h1>
            <div className="card">
                <button type="button" onClick={() => handleClick()}>
                    Capture HTML Classes
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <div>
                <h2>Captured Classes:</h2>
                <pre>{JSON.stringify(capturedClasses, null, 2)}</pre>
            </div>
        </>
    );
}

export default App;
