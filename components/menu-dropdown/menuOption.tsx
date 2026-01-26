import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface MenuOptionType{
    onSelect: ()=> void
    children: React.ReactNode
}

export default function MenuOption({onSelect,children}: MenuOptionType) {
  return (
    <TouchableOpacity onPress={onSelect} style={styles.menuOption}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuOption: {
    padding: 5,
  },
});