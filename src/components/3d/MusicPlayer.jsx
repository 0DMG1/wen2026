const [isPlaying, setIsPlaying] = useState(false);
const [currentTrack, setCurrentTrack] = useState(0);

const playlist = [
  { title: "You're Beautiful", url: "/music/track1.mp3" },
  { title: "Be Alright", url: "/music/track2.mp3" },
  // Agrega las que consideres especiales para ella
];

const audioRef = useRef(new Audio(playlist[currentTrack].url));

// Efecto para manejar Play/Pause
useEffect(() => {
  isPlaying ? audioRef.current.play() : audioRef.current.pause();
}, [isPlaying]);