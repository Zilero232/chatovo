    signingConfigs {
        create("release") {
            enableV1Signing = true
            enableV2Signing = true
            enableV3Signing = true
            val props = Properties()
            val propsFile = rootProject.file("keystore.properties")
            if (propsFile.exists()) {
                props.load(FileInputStream(propsFile))
            }
            keyAlias = props["keyAlias"] as String
            keyPassword = props["password"] as String
            storeFile = file(props["storeFile"] as String)
            storePassword = props["password"] as String
        }
    }
