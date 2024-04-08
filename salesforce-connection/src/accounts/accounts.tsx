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
import { Canvas, Circle, Path } from "@shopify/react-native-skia";
import { FontAwesome6 } from '@expo/vector-icons';

export interface Account {
  Id: string;
  Name: string;
  Phone: string;
}

interface IconProps {
  path: string;
  color: string;
}

const Icon = ({ path, color }: IconProps) => (
  <Canvas style={{ width: 148, height: 48 }}>
    <Circle cx={24} cy={24} r={24} color={color} />
    <FontAwesome6 name="user-tie" size={24} color="black" />
    <Path fillType="evenOdd" path={path} color="white" />
  </Canvas>
);


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
                          <View style={styles.cardImg}>
                            <Text>
                              <FontAwesome6 name="user-tie" size={20} color="white" />
                            </Text>
                          </View>
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
    backgroundColor: "#1F1D2B",
    height: "100%",
    width: "100%",
    color: "white",
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  header: {
    marginTop: 20,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
  },
  loading: {
    marginTop: 20,
    paddingHorizontal: 32,
    color: 'white',
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    paddingLeft: 32
  },
  sectionItems: {
    marginTop: 8,
    backgroundColor: '#272636',
    borderRadius: 32,
    paddingHorizontal: 13
  },
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
  },
  cardImg: {
    backgroundColor: '#3D88F4',
    borderRadius: 21,
    width: 42,
    height: 42,
    paddingLeft: 11,
    paddingTop: 8
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
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 3,
  },
  icon: {
    transform: [
      { translateX: 50 }, // adjust horizontal position
      { translateY: 50 }, // adjust vertical position
      { scaleX: 2 }, // adjust horizontal scale
      { scaleY: 2 }, // adjust vertical scale
    ],
  }
});
