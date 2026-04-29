import { StyleSheet, View } from 'react-native';
import { ShimmerPlaceholder } from '@/components/ui/ShimmerPlaceholder';

export const PaidPostTextPlaceholder = () => {
  return (
    <View style={styles.wrap}>
      <ShimmerPlaceholder
        width={164}
        height={26}
        borderRadius={22}
        style={styles.block}
      />
      <ShimmerPlaceholder
        width={361}
        height={40}
        borderRadius={22}
        style={styles.block}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
    paddingTop: 8,
  },
  block: {
    maxWidth: '100%',
  },
});
