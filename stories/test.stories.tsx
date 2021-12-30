import Test from './Test';
import {StoryFn} from "@storybook/react";

export default {
  component: Test,
  title: 'Test',
};

export type TestProps = { prefix: string; };
const Template: StoryFn<TestProps> = (args) => <Test {...args} />;

export const Default = Template.bind({});
Default.args = {prefix: 'Test'};