class ApexMapServices{

 

    static avgGrowthToGreenColor(avgGrowth) {
        if (avgGrowth < 0) {
            return 'gray';
        }

        if (avgGrowth <= 0.125) {
            return 'green_0';
        }
        if (avgGrowth <= 0.375) {
            return 'green_25';
        }
        if (avgGrowth <= 0.625) {
            return 'green_50';
        }
        if (avgGrowth <= 0.875) {
            return 'green_75';
        }
        if (avgGrowth <= 1) {
            return 'green_100';
        }
        return 'gray';
    }

}

export default ApexMapServices;