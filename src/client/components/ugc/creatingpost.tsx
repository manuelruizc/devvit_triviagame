import { useEffect, useState } from 'react';
import { PRIMARY_COLOR } from '../../helpers/colors';

const CreatingPost = () => {
  const [sleeping, setSleeping] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setSleeping(true);
    }, 2000);
  }, []);
  return (
    <div
      className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center z-50"
      style={{ backgroundColor: PRIMARY_COLOR }}
    >
      <img
        src={'/cat/catsleepinghard.png'}
        className="w-5/12 aspect-square object-contain object-center"
      />
      <span className="text-center text-lg max-w-6/12 mb-3">
        It's easy, but I'm tie-uhd... Well, you better ask to the people of the sub and see if they
        can solve it. Maybe see you there. {sleeping ? 'ZzzZZzZzZzZzZZz' : ''}
      </span>
    </div>
  );
};

export default CreatingPost;
