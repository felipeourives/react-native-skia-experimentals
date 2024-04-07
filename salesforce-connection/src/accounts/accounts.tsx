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
import { useNavigation } from "@react-navigation/native";

export interface Account {
  Id: string;
  Name: string;
  Phone: string;
}

export const Accounts = () => {

  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const apiResponse = await axios.get("/query?q=SELECT+Id,Name,Phone+FROM+Account");
        setAccounts(apiResponse.data.records);
      } catch (error) {
        console.error('Error fetching Salesforce accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const sections = useMemo(() => {
    if (!accounts) {
      return null;
    }

    const sectionsMap = accounts.reduce<Record<string, Account[]>>(
      (acc, account) => {
        const [firstLetter] = account.Name;

        return Object.assign(acc, {
          [firstLetter]: [...(acc[firstLetter] || []), account],
        });
      },
      {},
    );

    return Object.entries(sectionsMap)
      .map(([letter, items]) => ({
        letter,
        items: items.sort((a, b) => a.Name.localeCompare(b.Name)),
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [accounts]);

  const nav = useNavigation<any>();

  const goToScreen = (screenName: string, accountId: string, name: string, phone: string) => {
    nav.push(screenName, {
      accountId,
      name,
      phone
    });
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Accounts</Text>
        </View>

        {sections.length === 0 && <Text style={styles.loading}>Loading ...</Text>}

        {sections && sections.map(({ letter, items }) => (
          <View style={styles.section} key={letter}>
            <Text style={styles.sectionTitle}>{letter}</Text>
            <View style={styles.sectionItems}>
              {items.map(
                (
                  { Id, Name, Phone },
                  index,
                ) => {

                  return (
                    <View key={index} style={styles.cardWrapper}>
                      <TouchableOpacity
                        onPress={() => {
                          goToScreen("AccountDetails", Id, Name, Phone);
                        }}>
                        <View style={styles.card}>
                          <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>{Name}</Text>
                            <Text style={styles.cardPhone}>{Phone}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                },
              )}
            </View>
          </View>
        ))
        }
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
  loading: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 12,
    paddingLeft: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  sectionItems: {
    marginTop: 8,
  },
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cardBody: {
    marginRight: 'auto',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#616d79',
    marginTop: 3,
  },
});
