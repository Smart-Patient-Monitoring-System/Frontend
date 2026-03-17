export const parseAppleHealthData = (jsonData) => {
  try {
    const healthData = {
      steps: [],
      heartRate: [],
      spo2: [],
      sleep: [],
      calories: [],
      distance: [],
      workouts: [],
      flights: [],
      weight: [],
      activityRings: {
        move: { current: 0, goal: 600 },
        exercise: { current: 0, goal: 30 },
        stand: { current: 0, goal: 12 }
      }
    };

    if (!jsonData || !jsonData.data) {
      throw new Error('Invalid Apple Health data format');
    }

    const { data } = jsonData;

    if (data.metrics) {
      data.metrics.forEach(metric => {
        const { name, units, data: metricData } = metric;

        switch (name) {
          case 'step_count':
          case 'steps':
            healthData.steps = metricData.map(item => ({
              value: item.qty || item.value,
              date: new Date(item.date || item.startDate),
              source: item.source || 'Apple Watch'
            }));
            break;

          case 'heart_rate':
          case 'heartRate':
            healthData.heartRate = metricData.map(item => ({
              value: item.qty || item.value,
              date: new Date(item.date || item.startDate),
              type: item.context || 'resting',
              source: item.source || 'Apple Watch'
            }));
            break;

          case 'oxygen_saturation':
          case 'spo2':
          case 'blood_oxygen':
            healthData.spo2 = metricData.map(item => ({
              value: Math.round((item.qty || item.value) * 100),
              date: new Date(item.date || item.startDate),
              source: item.source || 'Apple Watch'
            }));
            break;

          case 'sleep_analysis':
          case 'sleep':
            healthData.sleep = metricData.map(item => ({
              duration: item.qty || item.value,
              startDate: new Date(item.startDate),
              endDate: new Date(item.endDate),
              quality: item.value || 'unknown',
              source: item.source || 'Apple Watch'
            }));
            break;

          case 'active_energy':
          case 'calories_burned':
            healthData.calories = metricData.map(item => ({
              value: item.qty || item.value,
              date: new Date(item.date || item.startDate),
              type: 'active',
              source: item.source || 'Apple Watch'
            }));
            break;

          case 'distance_walking_running':
          case 'distance':
            healthData.distance = metricData.map(item => ({
              value: item.qty || item.value,
              unit: units || 'km',
              date: new Date(item.date || item.startDate),
              source: item.source || 'Apple Watch'
            }));
            break;

          case 'flights_climbed':
            healthData.flights = metricData.map(item => ({
              value: item.qty || item.value,
              date: new Date(item.date || item.startDate),
              source: item.source || 'Apple Watch'
            }));
            break;

          case 'body_mass':
          case 'weight':
            healthData.weight = metricData.map(item => ({
              value: item.qty || item.value,
              unit: units || 'kg',
              date: new Date(item.date || item.startDate),
              source: item.source || 'Apple Watch'
            }));
            break;
        }
      });
    }

    if (data.workouts) {
      healthData.workouts = data.workouts.map(workout => ({
        type: workout.name || workout.workoutActivityType,
        duration: workout.duration,
        calories: workout.totalEnergyBurned,
        distance: workout.totalDistance,
        startDate: new Date(workout.startDate),
        endDate: new Date(workout.endDate),
        source: workout.source || 'Apple Watch'
      }));
    }

    const today = new Date().toDateString();
    const todaySteps = healthData.steps.filter(s => new Date(s.date).toDateString() === today);
    const todayCalories = healthData.calories.filter(c => new Date(c.date).toDateString() === today);
    const todayWorkouts = healthData.workouts.filter(w => new Date(w.startDate).toDateString() === today);

    healthData.activityRings.move.current = todayCalories.reduce((sum, c) => sum + c.value, 0);
    healthData.activityRings.exercise.current = todayWorkouts.reduce((sum, w) => sum + (w.duration / 60), 0);
    healthData.activityRings.stand.current = Math.min(12, Math.floor(todaySteps.length / 100));

    return healthData;
  } catch (error) {
    console.error('Error parsing Apple Health data:', error);
    throw error;
  }
};

export const parseGoogleFitData = (jsonData) => {
  try {
    const healthData = {
      steps: [],
      heartRate: [],
      spo2: [],
      sleep: [],
      calories: [],
      distance: [],
      workouts: [],
      flights: [],
      weight: [],
      activityRings: {
        move: { current: 0, goal: 600 },
        exercise: { current: 0, goal: 30 },
        stand: { current: 0, goal: 12 }
      }
    };

    if (!jsonData || !jsonData.bucket) {
      throw new Error('Invalid Google Fit data format');
    }

    jsonData.bucket.forEach(bucket => {
      bucket.dataset?.forEach(dataset => {
        const dataTypeName = dataset.dataTypeName;
        const points = dataset.point || [];

        points.forEach(point => {
          const startTime = new Date(parseInt(point.startTimeNanos) / 1000000);
          const endTime = new Date(parseInt(point.endTimeNanos) / 1000000);

          switch (dataTypeName) {
            case 'com.google.step_count.delta':
              const steps = point.value?.[0]?.intVal;
              if (steps) {
                healthData.steps.push({
                  value: steps,
                  date: startTime,
                  source: 'Android Health'
                });
              }
              break;

            case 'com.google.heart_rate.bpm':
              const heartRate = point.value?.[0]?.fpVal;
              if (heartRate) {
                healthData.heartRate.push({
                  value: Math.round(heartRate),
                  date: startTime,
                  type: 'measurement',
                  source: 'Android Health'
                });
              }
              break;

            case 'com.google.oxygen_saturation':
              const spo2 = point.value?.[0]?.fpVal;
              if (spo2) {
                healthData.spo2.push({
                  value: Math.round(spo2 * 100),
                  date: startTime,
                  source: 'Android Health'
                });
              }
              break;

            case 'com.google.sleep.segment':
              const sleepType = point.value?.[0]?.intVal;
              healthData.sleep.push({
                duration: (endTime - startTime) / (1000 * 60),
                startDate: startTime,
                endDate: endTime,
                quality: sleepType === 1 ? 'deep' : sleepType === 2 ? 'light' : 'rem',
                source: 'Android Health'
              });
              break;

            case 'com.google.calories.expended':
              const calories = point.value?.[0]?.fpVal;
              if (calories) {
                healthData.calories.push({
                  value: Math.round(calories),
                  date: startTime,
                  type: 'total',
                  source: 'Android Health'
                });
              }
              break;

            case 'com.google.distance.delta':
              const distance = point.value?.[0]?.fpVal;
              if (distance) {
                healthData.distance.push({
                  value: distance / 1000,
                  unit: 'km',
                  date: startTime,
                  source: 'Android Health'
                });
              }
              break;

            case 'com.google.activity.segment':
              const activityType = point.value?.[0]?.intVal;
              healthData.workouts.push({
                type: getActivityType(activityType),
                duration: (endTime - startTime) / (1000 * 60),
                startDate: startTime,
                endDate: endTime,
                source: 'Android Health'
              });
              break;

            case 'com.google.weight':
              const weight = point.value?.[0]?.fpVal;
              if (weight) {
                healthData.weight.push({
                  value: Math.round(weight * 10) / 10,
                  unit: 'kg',
                  date: startTime,
                  source: 'Android Health'
                });
              }
              break;
          }
        });
      });
    });

    const today = new Date().toDateString();
    const todaySteps = healthData.steps.filter(s => new Date(s.date).toDateString() === today);
    const todayCalories = healthData.calories.filter(c => new Date(c.date).toDateString() === today);
    const todayWorkouts = healthData.workouts.filter(w => new Date(w.startDate).toDateString() === today);

    healthData.activityRings.move.current = todayCalories.reduce((sum, c) => sum + c.value, 0);
    healthData.activityRings.exercise.current = todayWorkouts.reduce((sum, w) => sum + (w.duration / 60), 0);
    healthData.activityRings.stand.current = Math.min(12, Math.floor(todaySteps.reduce((sum, s) => sum + s.value, 0) / 1000));

    return healthData;
  } catch (error) {
    console.error('Error parsing Google Fit data:', error);
    throw error;
  }
};

const getActivityType = (typeCode) => {
  const activities = {
    0: 'In vehicle',
    1: 'Biking',
    2: 'On foot',
    3: 'Still',
    4: 'Unknown',
    5: 'Tilting',
    7: 'Walking',
    8: 'Running',
    9: 'Aerobics',
    10: 'Badminton',
    11: 'Baseball',
    12: 'Basketball',
    13: 'Biathlon',
    14: 'Handbiking',
    15: 'Mountain biking',
    16: 'Road biking',
    17: 'Spinning',
    18: 'Stationary biking',
    19: 'Utility biking'
  };
  return activities[typeCode] || 'Exercise';
};

export const parseCustomHealthData = (data) => {
  try {
    const healthData = {
      steps: [],
      heartRate: [],
      spo2: [],
      sleep: [],
      calories: [],
      distance: [],
      workouts: [],
      flights: [],
      weight: [],
      activityRings: {
        move: { current: 0, goal: 600 },
        exercise: { current: 0, goal: 30 },
        stand: { current: 0, goal: 12 }
      }
    };

    // Parse each type of data that exists in the custom format
    if (data.workouts && Array.isArray(data.workouts)) {
      data.workouts.forEach(workout => {
        // Extract workout summary
        healthData.workouts.push({
          type: workout.type || workout.name || workout.workoutActivityType || 'Outdoor Walk',
          duration: workout.duration || 0,
          calories: workout.calories || workout.totalEnergyBurned || 0,
          distance: workout.distance?.qty || workout.distance || workout.totalDistance || 0,
          startDate: workout.start ? new Date(workout.start) : new Date(),
          endDate: workout.end ? new Date(workout.end) : new Date(),
          source: workout.source || 'Custom'
        });

        // Extract heart rate data from heartRateRecovery
        if (workout.heartRateRecovery && Array.isArray(workout.heartRateRecovery)) {
          workout.heartRateRecovery.forEach(hr => {
            healthData.heartRate.push({
              value: hr.Avg || hr.value || hr.bpm || 0,
              date: hr.date ? new Date(hr.date) : new Date(),
              type: 'measurement',
              source: hr.source || 'Custom'
            });
          });
        }

        // Extract active energy (calories) data
        if (workout.activeEnergy && Array.isArray(workout.activeEnergy)) {
          workout.activeEnergy.forEach(energy => {
            healthData.calories.push({
              value: energy.qty || energy.value || 0,
              date: energy.date ? new Date(energy.date) : new Date(),
              source: energy.source || 'Custom'
            });
          });
        }

        // Extract distance data
        if (workout.walkingAndRunningDistance && Array.isArray(workout.walkingAndRunningDistance)) {
          workout.walkingAndRunningDistance.forEach(dist => {
            healthData.distance.push({
              value: dist.qty || dist.value || 0,
              date: dist.date ? new Date(dist.date) : new Date(),
              source: dist.source || 'Custom'
            });
          });
        }
      });
    }

    // Also parse top-level arrays if they exist
    if (data.steps && Array.isArray(data.steps)) {
      healthData.steps = data.steps.map(item => ({
        value: item.value || item.count || 0,
        date: item.date ? new Date(item.date) : new Date(),
        source: item.source || 'Custom'
      }));
    }

    if (data.heartRate && Array.isArray(data.heartRate)) {
      data.heartRate.forEach(item => {
        healthData.heartRate.push({
          value: item.value || item.bpm || 0,
          date: item.date ? new Date(item.date) : new Date(),
          type: item.type || 'measurement',
          source: item.source || 'Custom'
        });
      });
    }

    if (data.spo2 && Array.isArray(data.spo2)) {
      healthData.spo2 = data.spo2.map(item => ({
        value: item.value || 0,
        date: item.date ? new Date(item.date) : new Date(),
        source: item.source || 'Custom'
      }));
    }

    if (data.sleep && Array.isArray(data.sleep)) {
      healthData.sleep = data.sleep.map(item => ({
        duration: item.duration || 0,
        startDate: item.startDate ? new Date(item.startDate) : new Date(),
        endDate: item.endDate ? new Date(item.endDate) : new Date(),
        quality: item.quality || 'unknown',
        source: item.source || 'Custom'
      }));
    }

    if (data.calories && Array.isArray(data.calories)) {
      healthData.calories = data.calories.map(item => ({
        value: item.value || item.amount || 0,
        date: item.date ? new Date(item.date) : new Date(),
        type: item.type || 'active',
        source: item.source || 'Custom'
      }));
    }

    if (data.distance && Array.isArray(data.distance)) {
      healthData.distance = data.distance.map(item => ({
        value: item.value || 0,
        unit: item.unit || 'km',
        date: item.date ? new Date(item.date) : new Date(),
        source: item.source || 'Custom'
      }));
    }

    if (data.weight && Array.isArray(data.weight)) {
      healthData.weight = data.weight.map(item => ({
        value: item.value || 0,
        unit: item.unit || 'kg',
        date: item.date ? new Date(item.date) : new Date(),
        source: item.source || 'Custom'
      }));
    }

    if (data.flights && Array.isArray(data.flights)) {
      healthData.flights = data.flights.map(item => ({
        value: item.value || 0,
        date: item.date ? new Date(item.date) : new Date(),
        source: item.source || 'Custom'
      }));
    }

    // Calculate activity rings from ALL available data (not just today)
    // This ensures historical workout data is displayed in activity rings
    healthData.activityRings.move.current = Math.round(healthData.calories.reduce((sum, c) => sum + c.value, 0));
    healthData.activityRings.exercise.current = Math.round(healthData.workouts.reduce((sum, w) => sum + (w.duration / 60), 0));
    // Stand goal is harder to calculate from workouts, use a simple heuristic
    healthData.activityRings.stand.current = Math.min(12, Math.floor(healthData.workouts.length * 2));

    return healthData;
  } catch (error) {
    console.error('Error parsing custom health data:', error);
    throw error;
  }
};


export const validateHealthDataJSON = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (file.type !== 'application/json') {
      reject(new Error('File must be a JSON file'));
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      reject(new Error('File size must be less than 50MB'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

export const aggregateHealthData = (healthData) => {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const filterByDate = (data, startDate) => {
    return data.filter(item => {
      const itemDate = item.date || item.startDate;
      return new Date(itemDate) >= startDate;
    });
  };

  const average = (arr, key = 'value') => {
    if (arr.length === 0) return 0;
    return Math.round(arr.reduce((sum, item) => sum + (item[key] || 0), 0) / arr.length);
  };

  const sum = (arr, key = 'value') => {
    return Math.round(arr.reduce((sum, item) => sum + (item[key] || 0), 0));
  };

  // Use all available data instead of filtering by today's date
  // This ensures historical workout data is displayed
  return {
    today: {
      steps: sum(healthData.steps),
      avgHeartRate: average(healthData.heartRate),
      avgSpo2: average(healthData.spo2),
      calories: sum(healthData.calories),
      distance: (sum(healthData.distance) / 10) / 100,
      workouts: healthData.workouts.length
    },
    week: {
      avgSteps: average(healthData.steps),
      avgHeartRate: average(healthData.heartRate),
      avgSpo2: average(healthData.spo2),
      totalCalories: sum(healthData.calories),
      totalDistance: Math.round((sum(healthData.distance) * 10)) / 10,
      totalWorkouts: healthData.workouts.length
    },
    month: {
      avgSteps: average(healthData.steps),
      avgHeartRate: average(healthData.heartRate),
      avgSpo2: average(healthData.spo2),
      totalCalories: sum(healthData.calories),
      totalDistance: Math.round((sum(healthData.distance) * 10)) / 10,
      totalWorkouts: healthData.workouts.length
    }
  };
};
