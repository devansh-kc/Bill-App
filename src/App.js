import { useState } from 'react';
import './index.css';

const initialFriends = [
  {
    name: 'Clark',
    id: 118836,
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className='button' onClick={onClick}>
      {' '}
      {children}
    </button>
  );
}

export default function App() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  function showButton() {
    setShowAddFriend((el) => !el);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList
          friends={friends}
          selectFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FriendForm OnAddFriend={handleAddFriend} />}
        <Button onClick={showButton}>
          {showAddFriend ? 'close' : 'add friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          friendName={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectFriend={selectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, selectFriend, selectedFriend }) {
  const isSelectedFriend = selectedFriend?.id === friend.id;
  return (
    <li className={isSelectedFriend ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className='red'>
          you owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p> {friend.name} and you are even</p>}
      <Button onClick={() => selectFriend(friend)}>
        {isSelectedFriend ? 'close' : 'select'}
      </Button>
    </li>
  );
}

function FriendForm({ OnAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name && !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    OnAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  }
  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label> image url :</label>
      <input
        type='text'
        placeholder='url'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <label>friend's name :</label>
      <input
        type='text'
        placeholder='mia'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button>add</Button>
    </form>
  );
}

function FormSplitBill({ friendName, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');
  const paidByFriend = bill ? bill - paidByUser : '';
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  }
  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>split a bill with friend {friendName.name}</h2>
      <label> bill value</label>
      <input
        type='text'
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label> your expense</label>
      <input
        type='text'
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label> {friendName.name} 's expense</label>
      <input type='text' disabled value={paidByFriend} />
      <label>who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value='user'>you</option>
        <option value='friend'>{friendName.name}</option>
      </select>
      <Button>split bill</Button>
    </form>
  );
}
