import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Choice } from '../types';

interface ChoiceButtonProps {
  choice: Choice;
  onPress: () => void;
  index: number;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({ choice, onPress, index }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{index + 1}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{choice.text}</Text>
        {choice.consequence && (
          <Text style={styles.consequence}>💭 {choice.consequence}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    backgroundColor: '#2d3561',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#3d4571',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f39c12',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  number: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'right',
    lineHeight: 24,
    fontWeight: '600',
  },
  consequence: {
    color: '#a0a0a0',
    fontSize: 13,
    textAlign: 'right',
    marginTop: 6,
    fontStyle: 'italic',
  },
});
