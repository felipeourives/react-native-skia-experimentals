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
import { FontAwesome6 } from '@expo/vector-icons';

export interface AccountDetails {
  BillingAddress: {
    street: string,
    city: string,
    country: string,
  };
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
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardImg}>
              <Text>
                <FontAwesome6 name="phone" size={20} color="white" />
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>{phone}</Text>
            </View>
          </View>
          {AccountDetails && <View style={styles.card}>
            <View style={styles.cardImg}>
              <Text>
                <FontAwesome6 name="location-pin" size={20} color="white" />
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>{AccountDetails.BillingAddress.street}</Text>
              <Text style={styles.cardText}>{AccountDetails.BillingAddress.city}</Text>
              <Text style={styles.cardText}>{AccountDetails.BillingAddress.country}</Text>
            </View>
          </View>}
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
  section: {
    backgroundColor: "#272636",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    minHeight: 200
  },
  card: {
    paddingHorizontal: 24,
    paddingVertical: 14,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 3,
  },
  cardImg: {
    backgroundColor: '#3D88F4',
    borderRadius: 21,
    width: 42,
    height: 42,
    paddingLeft: 11,
    paddingTop: 8,
    alignContent: 'center'
  },
  cardBody: {
    marginRight: 'auto',
    paddingLeft: 19
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white'
  },
});
