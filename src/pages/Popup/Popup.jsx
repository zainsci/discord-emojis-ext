import React, { useEffect, useRef, useState } from 'react';
import './Popup.css';
import Input from '../../components/Input';
import Button from '../../components/Button';

const LS_EMOJI_KEY = '__emojis';
const EMOJI_URL = 'https://cdn.discordapp.com/emojis/';
const EMOJI_PARAMS = {
  size: 48,
  quality: 'lossless',
  animated: true,
};

const initEmojis = [];

function buildEmojiUrl(emojiID, params) {
  const url = new URL(EMOJI_URL + emojiID + '.webp');
  Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
  });

  return url.toString();
}

const Popup = () => {
  const [emojis, setEmojis] = useState([]);
  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const searchRef = useRef(null);
  const [delStatus, setDelStatus] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const emojisFromLS = localStorage.getItem(LS_EMOJI_KEY);

      if (!emojisFromLS) {
        loadInitEmojis();
      }

      const emojisList = JSON.parse(emojisFromLS);
      if (emojisList?.length > 0) {
        setEmojis(emojisList);
      } else {
        setEmojis(initEmojis);
      }
    }

    searchRef.current?.focus();
    searchRef.current.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        if (typeof window !== 'undefined') {
          const firstEmoji = document.querySelector('.emoji__item > img');
          if (firstEmoji) {
            navigator.clipboard.writeText(firstEmoji.src);
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_EMOJI_KEY, JSON.stringify(emojis));
    }
  }, [emojis]);

  function loadInitEmojis() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_EMOJI_KEY, JSON.stringify(initEmojis));
    }
  }

  function getEmojiLink(emojiID) {
    navigator.clipboard.writeText(buildEmojiUrl(emojiID, EMOJI_PARAMS));

    if (typeof window !== 'undefined') {
      const thisElem = document.querySelector('.ID_' + emojiID);
      thisElem.classList.add('copied');

      setInterval(() => {
        thisElem.classList.remove('copied');
      }, 2000);
    }
  }

  function handleFilter(e) {
    setFilter(e.target.value);
  }

  function handleEmojisClick(id) {
    if (delStatus) {
      const newEmojis = emojis.filter((item) => item.id !== id);
      setEmojis(newEmojis);
    } else {
      getEmojiLink(id);
    }
  }
  return (
    <div className="App bg-gray-700">
      {showAdd && (
        <AddEmoji
          show={showAdd}
          setShow={setShowAdd}
          emojiList={emojis}
          setEmojiList={setEmojis}
        />
      )}

      {showImportExport && (
        <ImportExportWindow
          show={showImportExport}
          setShow={setShowImportExport}
          emojis={JSON.stringify(emojis)}
          setEmojiList={setEmojis}
        />
      )}

      <header className="w-full flex flex-col mb-6 gap-4">
        <h2 className="text-white text-xl font-bold">Discord Emojis</h2>

        <div className="text-white flex items-center justify-between gap-4">
          <div>Count: {emojis.length}</div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowImportExport(!showImportExport)}
              className="text-sm h-8 px-4"
            >
              Import/Export
            </Button>
            <Button
              onClick={() => setShowAdd(!showAdd)}
              className="text-sm h-8 px-4"
            >
              Add
            </Button>
            <Button
              onClick={() => setDelStatus(!delStatus)}
              className="bg-red-600 text-sm h-8 px-4"
            >
              Del
            </Button>
          </div>
        </div>
      </header>
      <div className="px-2 mb-8">
        <Input
          name="search"
          placeholder="Search"
          className="w-full"
          onChange={handleFilter}
          innerRef={searchRef}
        />
      </div>
      <div className="h-[22rem] overflow-y-auto overflow-x-hidden bg-gray-900 p-4 rounded-md">
        <ul className="emoji__list flex justify-start items-start flex-wrap gap-1">
          {emojis &&
            emojis
              .filter((item) =>
                JSON.stringify(item).match(new RegExp(filter, 'ig'))
              )
              .map((emo) => (
                <li
                  className={`relative border p-2 overflow-hidden flex justify-center items-center cursor-pointer hover:bg-gray-800 rounded-md emoji__item ID_${
                    emo.id
                  } ${
                    delStatus ? 'border border-red-400' : 'border-transparent'
                  }`}
                  onClick={() => handleEmojisClick(emo.id)}
                  key={emo.id}
                >
                  <img
                    src={buildEmojiUrl(emo.id, EMOJI_PARAMS)}
                    alt={emo.name}
                    className="w-14 h-14 overflow-hidden"
                  />
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default Popup;

export function AddEmoji({ show, setShow, emojiList, setEmojiList }) {
  const [emoji, setEmoji] = useState({
    name: '',
    id: '',
    tags: '',
  });

  function onHandleOnChange(e) {
    setEmoji((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  }

  function onAddEmoji() {
    if (typeof window !== 'undefined') {
      const currEmojis =
        JSON.parse(localStorage.getItem(LS_EMOJI_KEY) ?? '[]') ?? [];
      const thisEmoji = {
        ...emoji,
        tags: [...emoji.tags.split(',').map((tag) => tag.trim())],
      };
      currEmojis.push(thisEmoji);
      setEmojiList(currEmojis);

      localStorage.setItem(LS_EMOJI_KEY, JSON.stringify(currEmojis));

      setShow(!show);
    }
  }

  return (
    <div className="absolute top-0 left-0 right-0 w-full h-full bg-gray-700 flex flex-col justify-center items-center p-6 gap-4 z-50">
      <h3 className="text-center text-white text-xl font-bold">
        Add a New Emoji
      </h3>

      <Input
        name="name"
        placeholder="Name"
        value={emoji.name}
        setValue={onHandleOnChange}
        className="w-full"
      />

      <Input
        name="id"
        placeholder="Emoji ID"
        value={emoji.id}
        setValue={onHandleOnChange}
        className="w-full"
      />

      <Input
        name="tags"
        placeholder="Tags"
        value={emoji.tags}
        setValue={onHandleOnChange}
        className="w-full"
      />

      <Button className="w-full" onClick={onAddEmoji}>
        Add
      </Button>
      <Button className="w-full" onClick={onAddEmoji}>
        Add
      </Button>
      <Button className="w-full bg-red-600" onClick={() => setShow(!show)}>
        Cancel
      </Button>
    </div>
  );
}

function ImportExportWindow({ emojis, show, setShow, setEmojiList }) {
  const [emojiJson, setEmojiJson] = useState('');

  function saveAsJson() {
    const blob = new Blob([emojis], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emojis.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importEmojis() {
    const emojisList = JSON.parse(emojiJson ?? '[]');
    if (typeof window !== 'undefined') {
      const currEmojis =
        JSON.parse(localStorage.getItem(LS_EMOJI_KEY) ?? '[]') ?? [];

      setEmojiList((emojis) => [...currEmojis, ...emojisList]);
      localStorage.setItem(LS_EMOJI_KEY, JSON.stringify(currEmojis));
      setShow(!show);
    }
  }

  return (
    <div className="absolute top-0 left-0 right-0 w-full h-full bg-gray-700 flex flex-col justify-center items-center p-6 gap-4 z-50">
      <div className="w-full h-full flex flex-col gap-4 justify-start">
        <div className="flex justify-end">
          <Button className="bg-blue-700" onClick={saveAsJson}>
            Export
          </Button>
        </div>

        <textarea
          name="e"
          id="emojiJson"
          value={emojiJson}
          onChange={(e) => setEmojiJson(e.target.value)}
        ></textarea>

        <Button className="bg-green-700" onClick={importEmojis}>
          Import
        </Button>
        <Button className="bg-red-700" onClick={() => setShow(!show)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
