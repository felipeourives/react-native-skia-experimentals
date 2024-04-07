import { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from ' ../../../axiosConfig';

export interface AccountDetails {
  BillingAddress: string;
}


export const AccountDetails = ({ route }) => {

  const { accountId, name, phone } = route.params;
  const [AccountDetails, setAccountDetails] = useState<AccountDetails>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const apiResponse = await axios.get("/query?q=SELECT+BillingAddress+FROM+Account+WHERE+Id='" + accountId + "'");
        setAccountDetails(apiResponse.data.records[0]);
      } catch (error) {
        console.error('Error fetching Salesforce account details:', error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>{phone}</Text>
          {AccountDetails && <>
            <Text style={styles.cardText}>{AccountDetails.BillingAddress.street}</Text>
            <Text style={styles.cardText}>{AccountDetails.BillingAddress.city}</Text>
            <Text style={styles.cardText}>{AccountDetails.BillingAddress.country}</Text>
          </>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  header: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  card: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexWrap: 'wrap'
  },
  cardText: {
    fontSize: 16,
    color: '#000',
  },
});
