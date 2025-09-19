import { useEffect, useState } from 'react';
import { PRIMARY_COLOR } from '../../helpers/colors';

const RenderText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState<string>('');

  useEffect(() => {
    let index = 0;
    const intervalTime = 1000 / text.length; // total 1 second divided by number of letters
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [text]);

  return <span className="text-center text-lg max-w-8/12">{displayedText}</span>;
};

const CreatingPost = () => {
  const [sleeping, setSleeping] = useState<boolean>(false);
  const [renderText, setRenderText] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setSleeping(true);
    }, 2400);
  }, []);
  return (
    <div
      className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center z-50"
      style={{ backgroundColor: PRIMARY_COLOR }}
    >
      <img
        src={sleeping ? '/cat/catsleepinghard.png' : '/cat/catwriting.png'}
        className="w-5/12 aspect-square object-contain object-center"
      />
      <span className="text-center text-lg max-w-8/12 mb-3">
        I'll remember that for sure... Let me take some notes
      </span>
      <span className="text-center text-lg max-w-8/12 mb-3">
        I swear I won't forget this time I will be 100% foc...
      </span>
      {sleeping ? (
        <RenderText
          text={`Let’s give a quick shoutout to Christina Applegate… brain’s done, I’m napping, asks to the guys in the sub... later.`}
        />
      ) : null}
    </div>
  );
};

export default CreatingPost;
