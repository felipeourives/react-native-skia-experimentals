import { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from ' ../../../axiosConfig';
import { Wallet } from '../Wallet';
import { Header } from '../Wallet/components/Header';

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
        <Header title={name} />
        <Wallet></Wallet>
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
    backgroundColor: "#1F1D2B",
    height: "100%",
    width: "100%",
    color: "white"
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
    color: 'white',
    marginBottom: 12,
  },
  card: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexWrap: 'wrap',
    backgroundColor: "#272636",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    minHeight: 200
  },
  cardText: {
    fontSize: 16,
    color: 'white',
  },
});
