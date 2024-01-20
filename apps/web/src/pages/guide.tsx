import { Box, Button, Heading } from '@chakra-ui/react';
import Guide from '../components/guide';

const steps = [
  {
    selector: '#guide1',
    title: 'Step One',
    content: <div>Guide One: This is the navigation bar</div>,
  },
  {
    selector: '#guide2',
    title: 'Step Two',
    content: 'Guide Two: This is the main article section',
  },
  {
    selector: '#guide3',
    title: 'Step Three',
    content: <div>Guide Three: This is the comment section</div>,
  },
  {
    selector: '#guide4',
    title: 'Step Four',
    content: 'Guide Four: This is the user-info section',
  },
];

function GuidePage() {
  return (
    <div className="bg-white w-full h-full">
      <Guide
        steps={steps}
        localKey="uni3-key"
        hotspot
        arrow
        onClose={() => console.log('Guide Closed')}
        beforeStepChange={(nextIndex) => console.log(`Going to: ${nextIndex}`)}
        afterStepChange={(nextIndex) => console.log(`Reached: ${nextIndex}`)}
        stepText={(stepIndex, stepCount) => `Step ${stepIndex} of ${stepCount}`}
        nextText="Next"
        prevText="Previous"
        showPreviousBtn
        okText="Finish"></Guide>

      <Box id="guide1" p="4">
        <Heading mb="2">Navigation Bar</Heading>
        <Button>Home</Button>
        <Button>About</Button>
        <Button>Contact</Button>
      </Box>
      <Box id="guide2" p="4">
        <Heading mb="2">Article Section</Heading>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </Box>
      <Box id="guide3" p="4">
        <Heading mb="2">Comment Section</Heading>
        <p>No comments yet. Be the first one to comment!</p>
      </Box>
      <Box id="guide4" p="4">
        <Heading mb="2">User Info Section</Heading>
        <p>Username: Mark</p>
        <Button colorScheme="blue">Logout</Button>
      </Box>
    </div>
  );
}

export default GuidePage;
