
export default function VideoBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <video
                autoPlay
                muted
                loop
                playsInline
                className="object-cover w-full h-full"
                poster="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2670&auto=format&fit=crop"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-fresh-vegetables-on-a-table-3413-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
