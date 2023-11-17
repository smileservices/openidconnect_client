export default function Waiting({text}) {
    return (
        <div className="overlay-waiting">
            <div className="waiting-container">
                <span className="icon-hour-glass spin-stop"> </span>
                <span className="text">{text}</span>
            </div>
        </div>
    )
}