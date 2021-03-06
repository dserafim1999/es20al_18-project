<template>
  <v-toolbar-items
    class="hidden-sm-and-down"
    hide-details
    v-if="this.$store.getters.outOfQuiz"
  >
    <v-menu open-on-click nudge-right="10" nudge-top="10" top>
      <template v-slot:activator="{ on }">
        <v-chip
          v-on="on"
          x-large
          class="footer front"
          color="primary"
          @click="setLastNotificationAccess"
        >
          <v-icon x-large style="padding: 0">
            notifications
          </v-icon>
          <v-chip v-if="unopened.length !== 0" color="error">
            <h3>{{ unopened.length }}</h3>
          </v-chip>
        </v-chip>
      </template>
      <v-list
        min-width="250"
        max-width="500"
        max-height="600"
        style="overflow-y: auto"
      >
        <v-list-item
          v-if="notifications.length === 0"
          style="padding: 10px 30px 10px 0;"
        >
          <v-icon x-large style="padding: 30px 30px;">far fa-meh</v-icon>
          <span style="text-align: left">
            <h3>{{ 'No Notifications' }}</h3>
            {{ 'Notifications will appear here as you use QuizzesTutor!' }}
          </span>
        </v-list-item>
        <v-list-item
          v-for="notification in this.notifications"
          :key="notification.id"
        >
          <notification-info
            :notification="notification"
            :unopened="isUnopenedNotification(notification)"
            :all="allOpened()"
          />
        </v-list-item>
        <v-list-item>
          <v-spacer />
          <v-btn :to="sendToNotificationsView()" color="primary"
            >View all</v-btn
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar-items>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import NotificationInfo from '@/components/NotificationInfo.vue';
import RemoteServices from '@/services/RemoteServices';
import Notification from '@/models/user/Notification';
import User from '@/models/user/User';

@Component({ components: { 'notification-info': NotificationInfo } })
export default class NotificationsButton extends Vue {
  @Prop({ type: User, required: true })
  readonly user!: User;

  notifications: Notification[] = [];
  unopened: Notification[] = [];
  oldUnopened: Notification[] = [];
  updated!: User;
  old!: string;

  async created() {
    navigator.serviceWorker.addEventListener('message', event =>
      this.addNotification(event)
    );
    await this.getNotifications();
  }

  async getNotifications() {
    await this.$store.dispatch('loading');
    try {
      [this.notifications] = await Promise.all([
        RemoteServices.getNotifications(this.user.username)
      ]);
      this.notifications = this.notifications
        .sort((a, b) => this.sortByDate(a, b))
        .slice(0, 5);
      this.updateUnopened();
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }

  @Watch('user.lastNotificationAccess')
  updateUnopened() {
    this.oldUnopened = this.unopened;
    this.unopened = this.notifications.filter(a =>
      this.isUnopened(a.creationDate)
    );
  }

  sortByDate(a: Notification, b: Notification) {
    if (a.id && b.id) return a.creationDate > b.creationDate ? -1 : 1;
    else return 0;
  }

  addNotification(event: MessageEvent) {
    const obj = event.data;
    if (event.data.usersId.indexOf(this.$store.getters.getUser.id) > -1) {
      const notification = new Notification(obj);
      this.notifications.unshift(notification);
      this.notifications = this.notifications
        .sort((a, b) => this.sortByDate(a, b))
        .slice(0, 5);
      this.updateUnopened();
    }
  }

  isUnopened(date: string) {
    return date >= this.$store.getters.getUser.lastNotificationAccess;
  }

  allOpened() {
    return this.oldUnopened.length === 0;
  }

  isUnopenedNotification(notification: Notification) {
    return this.oldUnopened.includes(notification);
  }

  async setLastNotificationAccess() {
    this.old = this.$store.getters.getUser.lastNotificationAccess;
    try {
      this.updated = await RemoteServices.setLastNotificationAccess();
      await this.$store.dispatch('updateUser', this.updated);
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
  }

  sendToNotificationsView() {
    let type = this.$store.getters.isStudent ? '/student' : '/management';
    return (
      type + '/notifications?username=' + this.$store.getters.getUser.username
    );
  }
}
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 25px;
  left: 25px;
}

.front {
  position: absolute;
  z-index: 100;
}
</style>
