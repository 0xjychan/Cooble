import Head from "next/head";
import React, { useState } from "react";
import styles from "./index.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { Grid } from 'react-loader-spinner'


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
        <link rel="icon" href="book3c.svg" />
      </Head>

      <main className={styles.main}>
        <img src="book3c.svg" className={styles.icon} />
        <h2>QuickRead</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="book"
            placeholder="Enter a Book Title"
            value={bookInput}
            onChange={(e) => setBookInput(e.target.value)}
          />
           {isLoading ? <div className={styles.load}><Grid height="80" width="80" color="#8A2BE2" ariaLabel="loading" radius="12.5" visible={true}/></div> : <input type="submit" value="Summarize" />}
        </form>
        {result == null || isLoading ? <div></div> : <div className={styles.container}><div className={styles.result}>{result.split('•').filter(text=>text !== '' && text !== '\n\n' && text !== '\n' && text !== ' \n\n' && text !== ' \n').map((str,index) => <li key={index}>{str}{'\n'}</li>)}</div></div>}
        <br></br>
        <br></br>
      </main>
      <div className={styles.footer}>&copy; QuickRead {new Date().getFullYear()}</div>
    </div>
  );
}
