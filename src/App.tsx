import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css'
import { useStopwatch } from 'react-timer-hook';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const drive = new URL("https://drive.google.com/file/d/1UsJBz1zEU4N6GlywD6wWW6V3YyemD7tV/preview")
drive.searchParams.set("t", "1")
drive.searchParams.set("autoplay", "1")
function App() {
  const btnClass = "h-9 cursor-pointer rounded-md bg-amber-400 px-4 py-2 text-amber-900 shadow hover:bg-amber-400/90"
  const [startFrom, setStartFrom] = useState(0);
  const [playState, setPlayState] = useState(false);
  const [driveUrl, setDriveUrl] = useState("");
  function getDriveIframe(url: string) {
    return `<iframe
            src="${url}"
            width="100%"
            height="100%"
            allow="autoplay"
            title="Google Drive Video"
            style="border: 'none'"
            allowFullScreen
          ></iframe>`
  }
  const onTimeClick = useCallback((time: number) => {
    drive.searchParams.set("t", String(time))
    setDriveUrl(drive.toString());
    setStartFrom(time)
  }, [driveUrl, startFrom])
  const DrivePlayer = useMemo(() => {
    return (<div style={{ position: "relative", width: "60%", height: "56.25%" }} dangerouslySetInnerHTML={{ __html: getDriveIframe(driveUrl) }} />)
  }, [driveUrl])
  return (
    <>
      <div className='h-screen w-screen bg-teal-900 text-white'>
        {DrivePlayer}
        <ServerVideoTimer startFrom={startFrom} playState={playState} />
        <div className="flex justify-center gap-2">
          <button className={cn(btnClass)} onClick={() => onTimeClick(0)}>0sec</button>
          <button className={cn(btnClass)} onClick={() => onTimeClick(5 * 60)}>5mins</button>
          <button className={cn(btnClass)} onClick={() => onTimeClick(10 * 60)}>10mins</button>
          <button className={cn(btnClass)} onClick={() => onTimeClick(1 * 60 * 60)}>1hour</button>
          <button className={cn(btnClass)} onClick={() => onTimeClick(5 * 60 * 60)}>5hour</button>
          <button className={cn(btnClass)} onClick={() => onTimeClick(Math.floor(Math.random() * 1 * 60 * 60))}>random</button>
          <button className={cn(btnClass, "bg-red-300 text-red-800 hover:bg-red-400/90")} onClick={() => setPlayState(!playState)}>toggle playState</button>
        </div>
      </div>


    </>
  )
}

export default App

const ServerVideoTimer = (
  { startFrom, playState, deps }:
    { startFrom: number, playState: boolean, deps?: any[] }
) => {
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ interval: 1000 });
  useEffect(() => {
    const stopwatchOffset = new Date();
    stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + startFrom);
    reset(stopwatchOffset);
  }, [startFrom, ...(deps || [])])
  useEffect(() => {
    if (playState) {
      pause();
    } else {
      start();
    }
  }, [playState])
  return <div className="my-4 text-center text-3xl text-white">
    {hours ? (<span>{String(hours).padStart(2, "0")}:</span>) : ""}
    <span>{String(minutes).padStart(2, "0")}:</span>
    <span>{String(seconds).padStart(2, "0")}</span>
    &nbsp;<span>{isRunning ? "(playing)" : "(paused)"}</span>
  </div>
}