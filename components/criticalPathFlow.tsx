import { type ActivityWithTiming } from "@/utils/cpm";
import { responsiveImageSize } from "@/utils/reponsiveImageSize";
import { responsiveFont } from "@/utils/responsiveFontSize";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

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

  return (
    <View
      style={{
        flexDirection: orientation === "horizontal" ? "row" : "column",
        alignItems: "center",
      }}
    >
      {criticalPath.map((a, index) => {
        // ---------- Flow type ----------
        if (type === "flow") {
          return (
            <React.Fragment key={`${a.label}-${index}`}>
              <LinearGradient
                colors={["#63D0FF", "#427CE8", "#235691"]}
                style={{ paddingHorizontal: 15, borderRadius: 6 }}
              >
                <Text style={{ color: "white", fontSize: responsiveFont(40) }}>{a.label}</Text>
              </LinearGradient>

              {index < criticalPath.length - 1 && (
                <Text style={{ color: "white", fontSize: responsiveFont(40) }}>
                  {orientation === "horizontal" ? "→" : "↓"}
                </Text>
              )}
            </React.Fragment>
          );
        }

        // ---------- Informative type ----------
        return (
          <View key={`${a.label}-${index}`} style={{flexDirection:"row", gap: 20}}>
            <LinearGradient
              colors={["#63D0FF", "#427CE8", "#235691"]}
              style={{ paddingHorizontal: 20, paddingVertical:10, borderRadius: 6, marginVertical: 10, alignItems:"center", justifyContent:"center"}}
            >
              <Text style={{ color: "white", fontSize: responsiveFont(20) }}>
                {a.label}
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={["#63D0FF", "#427CE8", "#235691"]}
              style={{ width: responsiveImageSize(120), paddingHorizontal: 10,  paddingVertical:10, borderRadius: 6, marginVertical: 10, alignItems:"flex-start" }}
            >
              <Text style={{ color: "white", fontSize: 20 }}>
                {a.expected} days
              </Text>
            </LinearGradient>
          </View>
        )
      })}
    </View>
  );
}
