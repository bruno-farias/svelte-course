<script>
  import {onMount} from 'svelte';
  import meetupsStore from "./Meetups/meetups-store.js";
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";
  import MeetupDetail from "./Meetups/MeetupDetail.svelte";
  import Loading from "./UI/Loading.svelte";

  let meetups = meetupsStore;
  let editMode = null;
  let editedId = null;
  let page = 'overview';
  let pageData = {};
  let isLoading = false;

  onMount(() => {
    isLoading = true;
    fetch('https://svelte-course-7fc33-default-rtdb.europe-west1.firebasedatabase.app/meetups.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Error while fetching data!')
        }
        return res.json();
      })
      .then(data => {
        const loadedMeetups = [];
        for (const key in data) {
          loadedMeetups.push({
            ...data[key],
            id: key
          });
        }

        setTimeout(() => {
          isLoading = false;
          meetupsStore.setMeetups(loadedMeetups);
        }, 1000);
      })
      .catch(err => {
        isLoading = false;
        console.log(err.message)
      })
  })

  function saveMeetup() {
    editMode = null;
    editedId = null;
  }

  function cancelEdit() {
    editMode = null;
    editedId = null;
  }

  function showDetails(event) {
    page = 'details';
    pageData.id = event.detail;
  }

  function closeDetails() {
    page = 'overview';
    pageData = {};
  }

  function startEdit(event) {
    editMode = 'edit';
    editedId = event.detail;
  }
</script>

<style>
    main {
        margin-top: 5rem;
    }
</style>

<Header/>

<main>
	{#if (page === 'overview')}
		{#if editMode === 'edit'}
			<EditMeetup id={editedId} on:save={saveMeetup} on:cancel={cancelEdit}/>
		{/if}
		{#if isLoading}
			<Loading/>
		{:else }
			<MeetupGrid
					meetups={$meetups}
					on:showdetails={showDetails}
					on:edit={startEdit}
					on:add={() => {editMode = 'edit'}}/>
		{/if}
	{:else}
		<MeetupDetail id={pageData.id} on:close={closeDetails}/>
	{/if}
</main>
