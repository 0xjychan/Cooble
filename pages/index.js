import Head from "next/head";
import React, { useState } from "react";
import styles from "./index.module.css";
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.css';

export default function Home() {
  const [bookInput, setBookInput] = useState("");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    console.log(isLoading);
    setIsLoading(true);
    console.log(isLoading);
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book: bookInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      console.log(data.result.split('•').filter(text=>text != ''));
      setIsLoading(false);
      console.log(isLoading);
      //setBookInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Quickread</title>
        <link rel="icon" href="/book.png" />
      </Head>

      <main className={styles.main}>
        <img src="/book.png" className={styles.icon} />
        <h2>QuickRead</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="book"
            placeholder="Enter a Book Title"
            value={bookInput}
            onChange={(e) => setBookInput(e.target.value)}
          />
           {isLoading ? <center><Spinner animation="border" role="status"/></center> : <input type="submit" value="Summarize" />}
        </form>
        <div>
        {result == null ? <div className={styles.result}>{result}</div> : <div className={styles.result}>{result.split('•').filter(text=>text !== '' && text !== '\n\n' && text !== '\n').map((str,index) => <li key={index}>{str}</li>)}</div>}
        </div>
      </main>
    </div>
  );
}
