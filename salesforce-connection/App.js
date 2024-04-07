import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from './axiosConfig';

export default function App() {

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const apiResponse = await axios.get("/query?q=SELECT+Id,Name+FROM+Account");
        setAccounts(apiResponse.data.records);
      } catch (error) {
        console.error('Error fetching Salesforce accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <View style={styles.container}>
      {accounts && accounts.map((account, index) => {
        return <Text key={index}>{account.Name}</Text>;

      })}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
