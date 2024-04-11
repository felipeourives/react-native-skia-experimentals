import { useState, useEffect } from 'react';
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
import data from "../Wallet/data.json";
import { Prices, DataPoints, PriceList } from "../Wallet/Model";

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

  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const apiResponse = await axios.get("/query?q=SELECT+BillingAddress+FROM+Account+WHERE+Id='" + accountId + "'");
        setAccountDetails(apiResponse.data.records[0]);
      } catch (error) {
        console.error('Error fetching Salesforce account details:', error);
      }

      const values = data.data.prices as Prices;
    };

    const fetchWallet = async () => {
      try {
        const apiResponseAll = await axios.get("/query?q=SELECT+Id,TimeUnix__c,Balance__c+FROM+Wallet__c+Where+Account__c='" + accountId + "'+ORDER+BY+TimeUnix__c");
        const apiResponseHour = await axios.get("/query?q=SELECT+Id,TimeUnix__c,Balance__c+FROM+Wallet__c+Where+Type__c='hour'+AND+Account__c='" + accountId + "'");
        const apiResponseDay = await axios.get("/query?q=SELECT+Id,TimeUnix__c,Balance__c+FROM+Wallet__c+Where+Type__c='day'+AND+Account__c='" + accountId + "'");
        const apiResponseMonth = await axios.get("/query?q=SELECT+Id,TimeUnix__c,Balance__c+FROM+Wallet__c+Where+Type__c='month'+AND+Account__c='" + accountId + "'");
        const apiResponseYear = await axios.get("/query?q=SELECT+Id,TimeUnix__c,Balance__c+FROM+Wallet__c+Where+Type__c='year'+AND+Account__c='" + accountId + "'");
        if (apiResponseHour.data.records.length > 0) {
          const pricesAll = apiResponseAll.data.records.map((item) => { return ["" + item.Balance__c + "", item.TimeUnix__c]; });
          const pricesHour = apiResponseHour.data.records.map((item) => { return ["" + item.Balance__c + "", item.TimeUnix__c]; });
          const pricesDay = apiResponseDay.data.records.map((item) => { return ["" + item.Balance__c + "", item.TimeUnix__c]; });
          const pricesMonth = apiResponseMonth.data.records.map((item) => { return ["" + item.Balance__c + "", item.TimeUnix__c]; });
          const pricesYear = apiResponseYear.data.records.map((item) => { return ["" + item.Balance__c + "", item.TimeUnix__c]; });
          const pricesData = {
            "latest": "10404.19502652",
            "latest_price": {
              "amount": {
                "amount": "10404.19502652",
                "currency": "CHF",
                "scale": "2"
              },
              "timestamp": "2020-09-03T07:54:24+00:00",
              "percent_change": {
                "hour": 0.008619466515323599,
                "day": -0.036829332796034134,
                "week": -0.006295281193811376,
                "month": 0.019727500038499168,
                "year": -0.006590892810039769
              }
            },
            "hour": {
              "percent_change": 0.008619466515323599,
              "prices": pricesHour
            },
            "day": {
              "percent_change": 0.008619466515323599,
              "prices": pricesDay
            },
            "month": {
              "percent_change": 0.008619466515323599,
              "prices": pricesMonth
            },
            "year": {
              "percent_change": 0.008619466515323599,
              "prices": pricesYear
            },
            "all": {
              "percent_change": 0.008619466515323599,
              "prices": pricesAll
            }
          } as Prices;
          setGraphData(pricesData);
        }
      } catch (error) {
        console.error('Error fetching Salesforce wallet:', error);
      }

    };

    fetchAccounts();
    fetchWallet();
  }, []);

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title={name} />
        {graphData && <Wallet graphData={graphData}></Wallet>}
        {(graphData && AccountDetails) && <View style={styles.section}>
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
          <View style={styles.card}>
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
          </View>
        </View>}
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
    paddingTop: 8,
    flexDirection: 'column',
    verticalAlign: 'middle',
    alignItems: 'center',
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
