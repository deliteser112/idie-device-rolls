import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

if (Meteor.settings.private && Meteor.settings.private.OAuth) {
  const OAuthSettings = Meteor.settings.private.OAuth;

  console.log('OAuthSettings', OAuthSettings);

  Object.keys(OAuthSettings).forEach((service) => {
    ServiceConfiguration.configurations.upsert({ service }, { $set: OAuthSettings[service] });
  });
} else {
  console.warn('OAuthSettings', Meteor.settings.private);
  console.warn(
    'Woof! OAuth settings are not configured. OAuth login will not function. See the documentation for configuration instructions.',
  );
}
