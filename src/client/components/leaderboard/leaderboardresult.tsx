import clsx from 'clsx';
import { GameScreens, useAppState } from '../../hooks/useAppState';
import { ACCENT_COLOR, ACCENT_COLOR2, SECONDARY_COLOR } from '../../helpers/colors';
import EmptyState from '../emptystate';

const hardcodedrank = [
  { 'member': 'User29', 'score': 1952, 'rank': 1 },
  { 'member': 'User100', 'score': 1927, 'rank': 2 },
  { 'member': 'User15', 'score': 1899, 'rank': 3 },
  { 'member': 'User68', 'score': 1849, 'rank': 4 },
  { 'member': 'User4', 'score': 1848, 'rank': 5 },
  { 'member': 'User36', 'score': 1846, 'rank': 6 },
  { 'member': 'webdevMX', 'score': 1840, 'rank': 7 },
  { 'member': 'User20', 'score': 1838, 'rank': 8 },
  { 'member': 'User82', 'score': 1818, 'rank': 9 },
  { 'member': 'User89', 'score': 1815, 'rank': 10 },
  { 'member': 'User54', 'score': 1814, 'rank': 11 },
  { 'member': 'User44', 'score': 1811, 'rank': 12 },
  { 'member': 'User64', 'score': 1806, 'rank': 13 },
  { 'member': 'User79', 'score': 1804, 'rank': 14 },
  { 'member': 'User26', 'score': 1794, 'rank': 15 },
  { 'member': 'User92', 'score': 1790, 'rank': 16 },
  { 'member': 'User14', 'score': 1782, 'rank': 17 },
  { 'member': 'User48', 'score': 1776, 'rank': 18 },
  { 'member': 'User43', 'score': 1774, 'rank': 19 },
  { 'member': 'User61', 'score': 1766, 'rank': 20 },
  { 'member': 'User73', 'score': 1763, 'rank': 21 },
  { 'member': 'User32', 'score': 1760, 'rank': 22 },
  { 'member': 'User63', 'score': 1757, 'rank': 23 },
  { 'member': 'User87', 'score': 1754, 'rank': 24 },
  { 'member': 'User21', 'score': 1751, 'rank': 25 },
  { 'member': 'User8', 'score': 1747, 'rank': 26 },
  { 'member': 'User6', 'score': 1744, 'rank': 27 },
  { 'member': 'User75', 'score': 1741, 'rank': 28 },
  { 'member': 'User7', 'score': 1739, 'rank': 29 },
  { 'member': 'User35', 'score': 1736, 'rank': 30 },
  { 'member': 'User23', 'score': 1733, 'rank': 31 },
  { 'member': 'User41', 'score': 1729, 'rank': 32 },
  { 'member': 'User71', 'score': 1725, 'rank': 33 },
  { 'member': 'User49', 'score': 1720, 'rank': 34 },
  { 'member': 'User56', 'score': 1717, 'rank': 35 },
  { 'member': 'User83', 'score': 1714, 'rank': 36 },
  { 'member': 'User11', 'score': 1711, 'rank': 37 },
  { 'member': 'User30', 'score': 1707, 'rank': 38 },
  { 'member': 'User95', 'score': 1704, 'rank': 39 },
  { 'member': 'User17', 'score': 1700, 'rank': 40 },
  { 'member': 'User66', 'score': 1696, 'rank': 41 },
  { 'member': 'User28', 'score': 1692, 'rank': 42 },
  { 'member': 'User77', 'score': 1689, 'rank': 43 },
  { 'member': 'User84', 'score': 1686, 'rank': 44 },
  { 'member': 'User53', 'score': 1682, 'rank': 45 },
  { 'member': 'User47', 'score': 1678, 'rank': 46 },
  { 'member': 'User93', 'score': 1675, 'rank': 47 },
  { 'member': 'User62', 'score': 1672, 'rank': 48 },
  { 'member': 'User97', 'score': 1669, 'rank': 49 },
  { 'member': 'User10', 'score': 1665, 'rank': 50 },
  { 'member': 'User38', 'score': 1661, 'rank': 51 },
  { 'member': 'User9', 'score': 1657, 'rank': 52 },
  { 'member': 'User98', 'score': 1653, 'rank': 53 },
  { 'member': 'User40', 'score': 1650, 'rank': 54 },
  { 'member': 'User25', 'score': 1646, 'rank': 55 },
  { 'member': 'User81', 'score': 1642, 'rank': 56 },
  { 'member': 'User39', 'score': 1639, 'rank': 57 },
  { 'member': 'User60', 'score': 1635, 'rank': 58 },
  { 'member': 'User91', 'score': 1632, 'rank': 59 },
  { 'member': 'User57', 'score': 1628, 'rank': 60 },
  { 'member': 'User18', 'score': 1624, 'rank': 61 },
  { 'member': 'User27', 'score': 1620, 'rank': 62 },
  { 'member': 'User46', 'score': 1617, 'rank': 63 },
  { 'member': 'User85', 'score': 1613, 'rank': 64 },
  { 'member': 'User37', 'score': 1609, 'rank': 65 },
  { 'member': 'User31', 'score': 1606, 'rank': 66 },
  { 'member': 'User72', 'score': 1602, 'rank': 67 },
  { 'member': 'User94', 'score': 1598, 'rank': 68 },
  { 'member': 'User65', 'score': 1595, 'rank': 69 },
  { 'member': 'User16', 'score': 1591, 'rank': 70 },
  { 'member': 'User55', 'score': 1587, 'rank': 71 },
  { 'member': 'User5', 'score': 1584, 'rank': 72 },
  { 'member': 'User78', 'score': 1580, 'rank': 73 },
  { 'member': 'User33', 'score': 1576, 'rank': 74 },
  { 'member': 'User13', 'score': 1572, 'rank': 75 },
  { 'member': 'User86', 'score': 1569, 'rank': 76 },
  { 'member': 'User45', 'score': 1565, 'rank': 77 },
  { 'member': 'User42', 'score': 1561, 'rank': 78 },
  { 'member': 'User19', 'score': 1558, 'rank': 79 },
  { 'member': 'User34', 'score': 1554, 'rank': 80 },
  { 'member': 'User12', 'score': 1550, 'rank': 81 },
  { 'member': 'User90', 'score': 1547, 'rank': 82 },
  { 'member': 'User76', 'score': 1543, 'rank': 83 },
  { 'member': 'User1', 'score': 1539, 'rank': 84 },
  { 'member': 'User22', 'score': 1536, 'rank': 85 },
  { 'member': 'User99', 'score': 1532, 'rank': 86 },
  { 'member': 'User3', 'score': 1528, 'rank': 87 },
  { 'member': 'User88', 'score': 1525, 'rank': 88 },
  { 'member': 'User52', 'score': 1521, 'rank': 89 },
  { 'member': 'User70', 'score': 1517, 'rank': 90 },
  { 'member': 'User58', 'score': 1514, 'rank': 91 },
  { 'member': 'User67', 'score': 1510, 'rank': 92 },
  { 'member': 'User80', 'score': 1507, 'rank': 93 },
  { 'member': 'User50', 'score': 1503, 'rank': 94 },
  { 'member': 'User96', 'score': 1499, 'rank': 95 },
  { 'member': 'User59', 'score': 1496, 'rank': 96 },
  { 'member': 'User74', 'score': 1492, 'rank': 97 },
  { 'member': 'User24', 'score': 1489, 'rank': 98 },
  { 'member': 'User51', 'score': 1485, 'rank': 99 },
  { 'member': 'User69', 'score': 1482, 'rank': 100 },
];

const emptyState = [];

const LeaderboardResult = ({ data }: { data: any }) => {
  const { member } = data;
  const { navigate, data: userData } = useAppState();

  if (data.leaderboard.length === 0) return <EmptyState />;

  return (
    <div className="w-full flex-1 box-border overflow-x-hidden overflow-y-scroll">
      <div className={clsx('w-full flex justify-center items-center box-border px-5 mb-2')}>
        <div
          className={clsx('w-full rounded-lg flex justify-around items-center h-12')}
          style={{ backgroundColor: ACCENT_COLOR2 }}
        >
          <span>{userData?.member || 'username'}</span>
          <span>{userData?.member ? member.user : 'Points'}</span>
        </div>
      </div>
      {data.leaderboard.map((item: any, idx: number) => (
        <div
          className={clsx('w-full flex justify-center items-center box-border px-5 mb-2')}
          key={idx}
        >
          <button
            // onClick={() => navigate(GameScreens.USER_PROFILE, item.member)}
            className={clsx(
              'w-full rounded-lg flex justify-around items-center h-12 cursor-pointer',
              item.member === member && 'border-black/60 border-4'
            )}
            style={{ backgroundColor: SECONDARY_COLOR }}
          >
            <span className="text-center flex-1">
              {item.rank}. {item.member}
            </span>
            <span className="text-center flex-1">{item.score} points</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardResult;
