import { useRouter } from 'next/router';
import ReactPlayer from 'react-player'
import styles from '../styles/player.module.css';

type playerProps = {
  id: number;
  closePlayer: () => void;
  startPlayer: () => void;
};

export default function Player({ closePlayer, id, startPlayer }: playerProps) {
  const router = useRouter();
  const sample = (id: number) => {
    fetch(`/api/startRental/${id}`, {
    }).then((response) => response.json()).then((data) => {
      if (data.result) {
        startPlayer()
      } else {
        router.push('/error')
      }
    });
  };
  return (
    <div className={styles.playerArea}>
      <ReactPlayer
        url={'https://www.youtube-nocookie.com/watch?v=Gqoby4CeA3Y'}
        className={styles.reactPlayer}
        width="70%"
        height="70%"
        controls={true}
        playing={true}
        onStart={() => sample(id)}
      />
      <div
        className={styles.closePlayer}
        onClick={() => closePlayer()}
      >
        ×
      </div>
    </div>
  );
}
