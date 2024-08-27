# Cartographer Research Notes

<p class="date-location">May 9, 2022 @ Nat'l Chiao Tung Univ.</p>
<hr>
<img src="assets/images/nctu-point-cloud-map.jpeg" alt="point-cloud-map">
<p class="image-title">Map of NCTU built with Cartographer</p>

## Preface
Cartographer was the first SLAM algorithm I encountered after joining Bob's lab. I spent quite a bit of time researching it, and I'm grateful to the senior students who patiently answered my questions, helping me understand more details about Cartographer. To assist others in getting up to speed more quickly, I decided to record various important points and insights. I hope this will be useful to you! Additionally, feel free to leave a comment if there's anything I didn't mention, and we can discuss it.

## Algorithm

<img src="assets/images/high_level_system_overview.png" alt="cartographer-flow">
<p class="image-title">Cartographer Flow Graph</p>

Cartographer is a SLAM (Simultaneous Localization and Mapping) algorithm, which can be divided into Local SLAM and Global SLAM components. Although these two parts seem independent, they are actually closely related. Below, I will explain this algorithm in three sections: Input, Local SLAM, and Global SLAM.

### Input

From the flowchart above, you can see that Cartographer can take in four types of input: Range data (such as point clouds), pose provided by odometry, linear acceleration and angular velocity from the IMU, and fixed frame pose (relative position to the Earth, such as GPS coordinates). These four inputs are processed separately before being fed into the Local SLAM.

### Processing Range Data

After the range data (e.g., point clouds) is ingested by Cartographer, it first goes through a bandpass filter that removes points too close to or too far from the origin (which could be errors). The definitions for "too close" and "too far" can be configured depending on the sensor specifications; for example, the Velodyne LiDAR used in Bob's lab has an effective range between 5 centimeters and 100 meters. Next, a voxel filter performs downsampling to reduce the number of points in the range data, which helps manage the computational load. The voxel filter size can be adjusted (as mentioned in the Configuration section). After downsampling, the range data is processed by an adaptive voxel filter. This filter is designed to separate the data into two different resolutions to improve efficiency during scan matching. Once these two filters have processed the range data, it is ready to be handed over to the Local SLAM system for subsequent scan matching.

### Processing Odometry Pose

Odometry provides pose information to the pose extrapolator, which uses it to predict the pose at the next moment. Additionally, this information is used in Global SLAM to optimize the poses of scans within each submap.

### Processing IMU Data

The IMU provides linear acceleration (in the x, y, and z directions) and angular velocity. This information is sent to the IMU tracker, which uses the z-direction acceleration to determine the direction of gravity. With the gravity direction known, the tracker can provide additional insights into the vehicle's pose, such as whether the vehicle is tilted. After processing in the IMU tracker, this data is passed to the previously mentioned pose extrapolator for pose prediction. Additionally, IMU data is used in Global SLAM to optimize the poses of scans within each submap.

### Processing Fixed Frame Pose

Pose information relative to the Earth, such as latitude and longitude from GPS, is used in Global SLAM to optimize the poses of scans within each submap.

### Local SLAM: Scan Matching using Ceres Solver

Once the range data has been processed and the pose extrapolator provides a prediction for the next pose, the data moves into Local SLAM for scan matching. Cartographer uses the Ceres solver to address the least-squares residuals problem in scan matching:

<img src="assets/images/formula.jpeg" alt="Least-squares Residuals Problem">
<p class="image-title">Least-squares Residuals Problem</p>

This problem seeks to find a pose (ξ) that minimizes the value of the following expression. In Local SLAM, the range data is stored using a probability grid, where each grid cell contains a probability representing the likelihood that there is something at that point (since LiDAR might detect pedestrians, which we don't want in the map, this method helps handle moving objects—more details can be found under Local SLAM: Submap). In the expression, T_ξ represents the transformation matrix needed to align with the pose ξ, and h_k represents a point on the range data. If there is an object at this point, the probability will be close to 1; otherwise, it will be close to 0. M_smooth is a smoothing function that makes the probability values more continuous, improving computational performance. By subtracting this probability from 1, if the transformation is optimal, the result should be a very small probability, so we aim to minimize this value.

Additionally, it’s important to note that Ceres scan matching starts with the low-resolution range data provided by the adaptive voxel filter to estimate an approximate pose. This is then refined using the high-resolution range data, which enhances the efficiency of scan matching.

### Local SLAM: Motion Filter

After scan matching, we obtain an optimal transformation. However, if the vehicle remains stationary and continuously performs scan matching on the same scan, it becomes meaningless and can affect Global SLAM by introducing scans that are too similar. This is one reason we need a motion filter. The purpose of the motion filter is to discard transformations that are not meaningful. To determine what constitutes a 'meaningless' transformation, we consider three factors: insufficient displacement, minimal rotation, and a time interval that is too short. If all three conditions are met, the motion filter will discard the scan. Conversely, if any one of these conditions is not met, the transformation is considered valid, and the scan will be added to the submap. For example, if the vehicle is stationary and the displacement and rotation are too small, the scan will be discarded. However, if the vehicle remains stationary for too long, new scans will be accepted by the submap because the time condition is not met.

### Local SLAM: Submap

In a submap, the range data is stored using the previously mentioned probability grid. Before any scans are added, each grid cell starts with two initial probabilities (which can be manually adjusted). These probabilities represent the likelihood that a point actually contains something or does not. The sum of these probabilities does not necessarily equal 1, but the probability of having something is always greater than 0.5, while the probability of having nothing is always less than 0.5. This estimation is necessary to filter out moving objects, as it's unlikely that no objects are moving near the vehicle during data collection—such as pedestrians or other vehicles—which we do not want to include in the map. Therefore, after performing scan matching on each range data, when adding it to the submap, the new probability grid is computed by combining it with the existing probability grid in the submap. If a certain area in the old submap is hit again in the next scan, the probability that there is something at that point will increase; conversely, the probability will decrease if the point is likely occupied by a moving object. Here is the formula and example for calculating the probability in the probability grid:

<img src="assets/images/probability-formula.jpeg" alt="probability formula">
<p class="image-title">Formula of Calculating Probability Grid and Example</p>

Each submap contains several range data (the number can be adjusted). After receiving a certain number of range data, the submap is considered complete and awaits optimization of the constraints between submaps by Global SLAM.

### Global SLAM

After Local SLAM accumulates a certain number of nodes, Global SLAM will run in the background. During scan matching in Local SLAM, there may be slight errors in the transformations between scans. These errors might be imperceptible over short distances, but if the vehicle completes a loop and returns to the starting point, it will be evident that the vehicle's position on the map differs from the original position due to the cumulative errors in Local SLAM. These errors become more pronounced over a complete loop. Global SLAM addresses this by establishing constraints between nodes and between submaps, effectively 'pulling' the entire map trajectory together like a string.

Another crucial concept is loop closure. Constraints can only be established after finding a loop closure. As Local SLAM continuously creates new submaps, Global SLAM checks whether the scans in the new submap have previously appeared. If they have, it indicates that the vehicle has completed a loop. This allows Global SLAM to establish constraints based on the simple principle that the start and end points must be the same.

In practice, loop closure is also a type of least-squares error minimization problem, as shown below:

<img src="assets/images/loop-closure.jpeg" alt="loop closure">
<p class="image-title">Least-squares Problem for Loop Closure</p>

This equation calculates the optimal submap pose and scan pose, which minimize the residual error in the subsequent equation (the E function). Before summing the residuals, they are processed through a loss function (Cartographer uses Huber loss), which aims to reduce the influence of outliers during the summation, preventing the results from being skewed by them.

After Global SLAM is completed, Cartographer runs a final optimization to refine the trajectory and make it smoother. Once everything is finished, you can export the map or conduct further research based on your specific needs.

## Map Output

If we want to view the constructed map, Cartographer provides some APIs for exporting it. Cartographer offers two methods for performing SLAM: online and offline. The way maps are exported differs between these two methods (online is more complicated). The following sections will explain each method separately.

### Online Node

If we are running demo_backpack_3d.launch or a modified launch file based on it, then SLAM is being performed in the online mode. After the bag file finishes playing, we need to execute the following two ROS services:

<img src="assets/images/map-launch.jpeg" alt="map launch code">
<p class="image-title">Command for Running the Service</p>

The purpose of the /finish_trajectory service is to inform Cartographer that there is no more data left for SLAM, allowing the ongoing trajectory to be finalized. The /write_state service then exports the entire trajectory's pose information into a .pbstream file, which can be used along with the original bag file to create the map.

### Offline Node

If we are running offline_backpack_3d.launch or a modified launch file based on it, then SLAM is being performed in offline mode. In this case, we just need to wait for the node to finish running, as it will automatically generate a .pbstream file. No additional actions are required.

<br><br><br>
