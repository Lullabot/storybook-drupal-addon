import Test, {TestProps} from './Test';
import {StoryFn} from "@storybook/react";

export default {
  component: Test,
  title: 'Test',
};

const Template: StoryFn<TestProps> = (args) => <Test {...args} />;

export const Default = Template.bind({});
Default.args = {prefix: 'Test'};