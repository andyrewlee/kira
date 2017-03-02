import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import moment from 'moment';

import {
  View,
  Text,
  TabBarIOS,
  StyleSheet,
  NavigatorIOS,
  Alert
} from 'react-native';

import Diary from './Diary';
import DiaryEntry from './DiaryEntry';

export default class DiaryScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myDiaryEntries: myDiaryEntries,
      allDiaryEntries: allDiaryEntries
    };
  }

  handleLogout() {
    this.props.handleLogout();
  }

  handleDiaryEntry(entryId) {
    const selectedEntry = allDiaryEntries.filter((entry) => {
      return entry.id == entryId;
    })[0];

    const nextRoute = {
      component: DiaryEntry,
      barTintColor: '#d7baa1',
      tintColor: '#404040',
      titleTextColor: '#800000',
      passProps: { selectedEntry: selectedEntry }
    };

    this.refs.nav.push(nextRoute);
  }

  addEntry(text) {
    const newEntry = {
      id: Math.floor(Math.random() * 50) + 20,
      body: text,
      created_at: moment()
    };


    let currentDiaryEntries = this.state.allDiaryEntries;
    let currentMyDiaryEntries = this.state.myDiaryEntries;

    currentDiaryEntries.push(newEntry);
    currentMyDiaryEntries.unshift(newEntry);

    this.setState({
      allDiaryEntries: currentDiaryEntries,
      myDiaryEntries: currentMyDiaryEntries
    }, console.log(this.state));
  }

  render() {
    return (
      <NavigatorIOS
        ref="nav"
        initialRoute={{
          component: Diary,
          title: 'kira',
          barTintColor: '#d7baa1',
          tintColor: '#404040',
          titleTextColor: '#800000',
          rightButtonIcon: require('../../images/logout.png'),
          onRightButtonPress: () => this.handleLogout(),
          passProps: {
            handleDiaryEntry: this.handleDiaryEntry.bind(this),
            myDiaryEntries: this.state.myDiaryEntries,
            allDiaryEntries: this.state.allDiaryEntries,
            addEntry: this.addEntry.bind(this)
          }
        }}
        style={{flex: 1}}
      />
    );
  }
}

const myDiaryEntries = [
  {
    id: 3,
    body: "20 years from now I won't remember today. These are the words that pushed me to start writing a diary. I probably won't write it here but seeing this in my post history is a good reminder.",
    created_at: moment('2017-03-01T22:52:06-08:00')
  },
  {
    id: 2,
    body: "Forget about showering. Forget about cleaning. Showers that need scrubbing. Dinner. Dogs that need to be walked. Bills that need to be paid. Doctors I need to call back. Appointments that need to be made.",
    created_at: moment('2017-03-01T23:50:58-08:00')
  },
  {
    id: 1,
    body: "My bed. 6 pillows. 4 heavy blankets. Cool sheets. So warm. So comforting. So safe. Lying in bed with the covers drawn over my head. Leaving a small hole to breathe out of. Closing my eyes. For now the problems and worries are non-existent. I forget about the to-do list.",
    created_at: moment('2017-03-01T21:52:06-08:00')
  }
];

const allDiaryEntries =  [
  {
    id: 1,
    body: "My bed. 6 pillows. 4 heavy blankets. Cool sheets. So warm. So comforting. So safe. Lying in bed with the covers drawn over my head. Leaving a small hole to breathe out of. Closing my eyes. For now the problems and worries are non-existent. I forget about the to-do list.",
    created_at: moment('2017-03-01T21:52:06-08:00')
  },
  {
    id: 4,
    body: "Love is a lie that we happily feed ourselves from generation to generation. For what, though? I don't get it. Granted, my opinion is slightly biased, I've had my heartbroken a time or two. However, the vast amounts of time in between each relationship has given me time to think on the matter.",
    created_at: moment('2017-03-01T21:52:06-08:00')
  },
  {
    id: 3,
    body: "20 years from now I won't remember today. These are the words that pushed me to start writing a diary. I probably won't write it here but seeing this in my post history is a good reminder.",
    created_at: moment('2017-03-01T22:52:06-08:00')
  },
  {
    id: 6,
    body: "I think memory is part choice. If you have a conversation with someone about yourself, most of the time they'll only recollect bits and pieces of whatever it was you had to say unless the information pertained to them somehow.",
    created_at: moment('2017-03-01T22:52:06-08:00')
  },
  {
    id: 2,
    body: "Forget about showering. Forget about cleaning. Showers that need scrubbing. Dinner. Dogs that need to be walked. Bills that need to be paid. Doctors I need to call back. Appointments that need to be made.",
    created_at: moment('2017-03-01T23:50:58-08:00')
  },
  {
    id: 5,
    body: "I suppose the answer is simple: from the beginning. I stumbled onto an old journal I used to write in when I was struggling with self-harm and self-loathing.",
    created_at: moment('2017-03-01T23:50:58-08:00')
  },
  {
    id: 12,
    body: "What is isolation? The only answer I can come up with is complete seclusion from any other human contact. Of course, the statement seems broad, but the practice of isolation and the results proceeding such is broad.",
    created_at: moment('2017-03-01T23:50:58-08:00')
  },
  {
    id: 7,
    body: "I keep dreaming of building a place where i fit in. I grew up in the south. The bible and family was the center of life. My grand father had ten children of them my father was the fifth, so i grew up surrounded by people.",
    created_at: moment('2017-03-01T23:50:58-08:00')
  },
  {
    id: 8,
    body: "I have come back since then and calmed down thinking it was the raw negative emotion but i found that it was not so. In studying the bible i found that i did not even believe the claim that a god existed. I dont know if i was forced to grow up but it hurt to lose so much all at once.",
    created_at: moment('2017-03-01T23:50:58-08:00')
  },
  {
    id: 9,
    body: "My parents fight all the time. It seems every other morning that I wake up to a meaningless, heated argument about how my dad has no respect for my mom or about how my dad is always wrong according to my mom.",
    created_at: moment('2017-03-01T23:50:58-08:00')
  },
  {
    id: 10,
    body: "I'm a 22 year old in Ann Arbor. I graduated and am spending the year applying to law school and generally just relaxing and dicking around. I'm trying this diary thing out as a way of building confidence in sharing things about myself.",
    created_at: moment('2017-03-01T23:50:58-08:00')
  },
  {
    id: 11,
    body: "A 21-year old IT student in Varazdin, Croatia. I was born in the capital, Zagreb, and have so far fucked up 2 years of university (I switched).",
    created_at: moment('2017-03-01T23:50:58-08:00')
  }
];
