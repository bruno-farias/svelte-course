import {writable} from "svelte/store";

const meetupsStore = writable([
  {
    id: 1,
    title: "Coding bootcamp",
    subtitle: "Learn to code in 2 hours",
    description: "In this meetup, we will have some experts that teach you how to code",
    imageUrl: "https://ubiqum.com/assets/uploads/2021/12/ubiqum-coding-bootcamp.jpg",
    address: "27th Nerd road, 32524 New York",
    contactEmail: "code@test.com",
    isFavorite: false
  }, {
    id: 2,
    title: "Swim together",
    subtitle: "let's go for some swim",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Depart4x100.jpg",
    address: "9567 Dogwood St.Round Lake, IL 60073",
    contactEmail: "swim@test.com",
    isFavorite: false
  },
]);

const customMeetupStore = {
  subscribe: meetupsStore.subscribe,
  addMeetup: (meetupData) => {
    const newMeetUp = {
      ...meetupData,
      id: Math.random().toString(),
      isFavorite: false
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