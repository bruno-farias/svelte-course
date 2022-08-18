<script>
	import {createEventDispatcher} from "svelte";
  import MeetupItem from "./MeetupItem.svelte";
  import Meetupfilter from "./Meetupfilter.svelte";
  import Button from "../UI/Button.svelte";
  import {scale} from "svelte/transition"
  import {flip} from "svelte/animate";

  const dispatch = createEventDispatcher();
  export let meetups = [];

  let favsOnly = false;

  $: filteredMeetups = favsOnly ? meetups.filter(m => m.isFavorite) : meetups;

  function setFilter(event) {
	  favsOnly = event.detail === 1;
  }
</script>

<style>
    .meetups {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }
    .meetup-controls {
		    margin: 1rem;
		    display: flex;
		    justify-content: space-between;
    }

    @media (min-width: 768px) {
        .meetups {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
<section class="meetup-controls">
	<Meetupfilter on:select={setFilter}/>
	<Button on:click={() => dispatch('add')}>New Meetup</Button>
</section>
<section class="meetups">
	{#each filteredMeetups as meetup (meetup.id)}
		<div animate:flip={{duration: 300}} transition:scale>
			<MeetupItem
					id={meetup.id}
					title={meetup.title}
					subTitle={meetup.subtitle}
					description={meetup.description}
					imageUrl={meetup.imageUrl}
					email={meetup.contactEmail}
					address={meetup.address}
					isFav={meetup.isFavorite}
					on:showdetails
					on:edit
			/>
		</div>
	{/each}
</section>