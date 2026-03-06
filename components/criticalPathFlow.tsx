import { type ActivityWithTiming } from "@/utils/cpm";
import { responsiveSize } from "@/utils/reponsiveSize";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function CriticalPathFlow({
  criticalPath,
  orientation = "vertical",
  type = "flow",
}: {
  criticalPath: ActivityWithTiming[];
  orientation?: "horizontal" | "vertical";
  type?: "flow" | "informative";
}) {
  if (criticalPath.length === 0) {
    return <Text style={{ color: "white" }}>N/A</Text>;
  }

  const isHorizontal = orientation === "horizontal";

  if (type === "flow") {
    const Container = isHorizontal ? ScrollView : View;

    return (
      <Container
        horizontal={isHorizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: isHorizontal ? "row" : "column",
          alignItems: "center",
          gap: responsiveSize(12),
          paddingVertical: responsiveSize(10),
        }}
        style={{ flexGrow: 0 }}
      >
        {criticalPath.map((a, index) => (
          <React.Fragment key={`${a.label}-${index}`}>
            <LinearGradient
              colors={["#63D0FF", "#427CE8", "#235691"]}
              style={{
                paddingHorizontal: responsiveSize(16),
                paddingVertical: responsiveSize(8),
                borderRadius: 8,
                maxWidth: responsiveSize(120),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: "white",
                  fontSize: responsiveSize(18),
                }}
              >
                {a.label}
              </Text>
            </LinearGradient>

            {index < criticalPath.length - 1 && (
              <Text
                style={{
                  color: "white",
                  fontSize: responsiveSize(22),
                  textAlign:"center"
                }}
              >
                {isHorizontal ? "→" : "↓"}
              </Text>
            )}
          </React.Fragment>
        ))}
      </Container>
    );
  }

  return (
    <ScrollView
      style={{ maxHeight: responsiveSize(350) }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: responsiveSize(20),
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
      }}
    >
      {criticalPath.map((a, index) => (
        <View
          key={`${a.label}-${index}`}
          style={{
            flexDirection: "row",
            gap: responsiveSize(10),
          }}
        >
          <LinearGradient
            colors={["#63D0FF", "#427CE8", "#235691"]}
            style={{
              paddingHorizontal: responsiveSize(20),
              paddingVertical: responsiveSize(10),
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              maxWidth: responsiveSize(140),
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: "white",
                fontSize: responsiveSize(18),
              }}
            >
              {a.label}
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={["#63D0FF", "#427CE8", "#235691"]}
            style={{
              width: responsiveSize(120),
              paddingHorizontal: responsiveSize(10),
              paddingVertical: responsiveSize(10),
              borderRadius: 6,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: responsiveSize(16),
              }}
            >
              {a.expected} days
            </Text>
          </LinearGradient>
        </View>
      ))}
    </ScrollView>
  );
}