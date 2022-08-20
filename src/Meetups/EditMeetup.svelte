<script>
  import meetupsStore from "./meetups-store.js";
  import {createEventDispatcher} from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import {isEmpty} from "../helpers/validation.js";

  const dispatch = createEventDispatcher();

  export let id = null;

  let title = '';
  let subtitle = '';
  let address = '';
  let email = '';
  let description = '';
  let imageUrl = '';
  let selectedMeetup;

  if (id) {
    const unsubscribe = meetupsStore.subscribe(items => {
      selectedMeetup = items.find(i => i.id === id);
      title = selectedMeetup.title;
      subtitle = selectedMeetup.subtitle;
      address = selectedMeetup.address;
      email = selectedMeetup.contactEmail;
      description = selectedMeetup.description;
      imageUrl = selectedMeetup.imageUrl;
    });
    unsubscribe();
  }

  $: titleValid = !isEmpty(title);
  $: subtitleValid = !isEmpty(subtitle);
  $: addressValid = !isEmpty(address);
  $: emailValid = !isEmpty(email);
  $: descriptionValid = !isEmpty(description);
  $: imageUrlValid = !isEmpty(imageUrl);
  $: formIsValid = titleValid && subtitleValid && addressValid && emailValid && descriptionValid && imageUrlValid;

  function submitForm() {
    const meetupData = {
      title: title,
      subtitle: subtitle,
      description: description,
      imageUrl: imageUrl,
      address: address,
      contactEmail: email
    }
    if (id) {
      fetch(`https://svelte-course-7fc33-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`, {
        method: 'PATCH', //using patch to not replace the whole object, but just info we send
        body: JSON.stringify(meetupData),
        headers: {'Content-Type': 'application/json'}
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to update data')
          }
          meetupsStore.updateMeetup(id, meetupData);
        })
        .catch(err => {
          console.log({err})
        })
    } else {
      fetch('https://svelte-course-7fc33-default-rtdb.europe-west1.firebasedatabase.app/meetups.json', {
        method: 'POST',
        body: JSON.stringify({...meetupData, isFavorite: false}),
        headers: {'Content-Type': 'application/json'}
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to save new meetup!')
          }
          return res.json();
        })
        .then(data => {
          meetupsStore.addMeetup({...meetupData, isFavorite: false, id: data.name})
        })
        .catch(err => {
          console.log(err)
        });
    }
    dispatch('save')
  }

  function cancel() {
    dispatch('cancel')
  }

  function deleteMeetup() {
    fetch(`https://svelte-course-7fc33-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error while deleting meetup');
        }
        meetupsStore.deleteMeetup(id)
      })
      .catch(err => {
        console.log({err})
      })

    dispatch('save')
  }

</script>

<style>
    form {
        max-width: 100%;
    }
</style>

<Modal title="Add Meetup data" on:cancel>
	<form on:submit|preventDefault={submitForm}>
		<TextInput
				id="title"
				label="Title"
				valid={titleValid}
				validityMessage="Please enter a valid message"
				value={title}
				on:input={event => (title = event.target.value)}/>
		<TextInput
				id="subtitle"
				label="Subtitle"
				valid={subtitleValid}
				validityMessage="Please enter a valid sub title"
				value={subtitle}
				on:input={event => (subtitle = event.target.value)}/>
		<TextInput
				id="address"
				label="Address"
				valid={addressValid}
				validityMessage="Please enter a valid adress"
				value={address}
				on:input={event => (address = event.target.value)}/>
		<TextInput
				id="imageUrl"
				label="ImageUrl"
				valid={imageUrlValid}
				validityMessage="Please enter a valid image url"
				value={imageUrl}
				on:input={event => (imageUrl = event.target.value)}/>
		<TextInput
				id="email"
				label="Email"
				type="email"
				valid={emailValid}
				validityMessage="Please enter an valid email "
				value={email}
				on:input={event => (email = event.target.value)}/>
		<TextInput id="description"
		           label="Description"
		           controlType="textarea"
		           rows="3"
		           valid={descriptionValid}
		           validityMessage="Please enter some description"
		           bind:value={description}/>
	</form>
	<div slot="footer">
		<Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
		<Button type="button" on:click={submitForm} disabled={!formIsValid}>Save</Button>
		{#if id}
			<Button type="button" on:click={deleteMeetup}>Delete</Button>
		{/if}
	</div>
</Modal>