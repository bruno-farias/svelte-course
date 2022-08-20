import {writable} from "svelte/store";

const meetupsStore = writable([]);

const customMeetupStore = {
  subscribe: meetupsStore.subscribe,
  setMeetups: (meetupArray) => {
    meetupsStore.set(meetupArray);
  },
  addMeetup: (meetupData) => {
    const newMeetUp = {
      ...meetupData,
    };
    meetupsStore.update(items => {
      return [newMeetUp, ...items];
    })
  },
  updateMeetup: (id, meetupData) => {
    meetupsStore.update(items => {
      const meetupIndex = items.findIndex(i => i.id === id);
      const updatedMeetup = {...items[meetupIndex], ...meetupData};
      const updatedMeetups = [...items]
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    })
  },
  deleteMeetup: (id) => {
    meetupsStore.update(items => {
      return items.filter(item => item.id !== id);
    })
  },
  toggleFavorite: (id) => {
    meetupsStore.update(items => {
      const updatedMeetup = {...items.find(m => m.id === id)};
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      const meetupIndex = items.findIndex(m => m.id === id);
      const updatedMeetups = [...items]
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
};

export default customMeetupStore;